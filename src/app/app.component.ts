import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounce, isEmpty, isEqual } from 'lodash';
import moment from 'moment-timezone';
import { environment } from 'src/environments/environment';

import { GeoLocation } from './classes/geolocation.class';
import { SearchOptions } from './components/header/header.component';
import { NearbyResult, UserInfoResult } from './graphql/queries';
import { MapUpdateEvent } from './interfaces/events/map-update.interface';
import { SearchResult, UserInfo } from './interfaces/graphql';
import { AppStoreService } from './services/appState.service';
import { GeoService, PlaceSuggestion } from './services/geo.service';
import { I18nService } from './services/i18n.service';
import { PersistanceService } from './services/persistanceService';
import { WciApiService } from './services/wciApi.service';
import { Poi } from './utils/Poi';

@Component({
  selector: 'wci-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  zoom = 11;
  year = new Date().getFullYear();

  hasBrowserGeolocation = navigator && navigator.geolocation;
  hasActivatedBrowserGeolocation = false;
  currentLocation: GeoLocation = new GeoLocation(0, 0);
  currentOrientation: number | undefined;
  userLocation: GeoLocation;
  nearbyPois: SearchResult;
  nearbyOsmPois: object;
  // latestPois: SearchResult;

  showContent = false;
  isFloatingContent = false;
  isNearbyLoading = true;
  isOsmNearbyLoading = true;
  // isLatestLoading = true;

  environment = environment;

  private mapData: MapUpdateEvent;
  private userData: UserInfo;
  private latestSearchOptions: SearchOptions;

  private nearbyQueryController: AbortController;
  private osmQueryController: AbortController;

  // miles
  private osmRadiusThreshold = 137;

  // ms
  private mapInteractionDebounceTime = 250;

  constructor(
    private translate: TranslateService,
    private api: WciApiService,
    private geoService: GeoService,
    private router: Router,
    private route: ActivatedRoute,
    private appStore: AppStoreService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.showContent = !!this.route.root.firstChild.snapshot.data.type;
        this.isFloatingContent = this.route.root.firstChild.snapshot.data.isFloatingContent;
      }
    });

    this.appStore.watchProperty('currentLocation').subscribe((location: GeoLocation) => {
      if (location && !isEqual(location, this.currentLocation)) {
        this.currentLocation = location;
        // this.getLatest();
        this.getNearby();
      }
    });

    this.appStore.watchProperty('currentUserLocation').subscribe((location: GeoLocation) => {
      if (location && !isEqual(location, this.userLocation)) {
        this.userLocation = location;
      }
    });

    this.onMapReadyOrUpdate = debounce(this.onMapReadyOrUpdate, this.mapInteractionDebounceTime);
  }

  ngOnInit(): void {
    this.bootstrap();
  }

  /**
   *
   */
  onMapReadyOrUpdate($event: MapUpdateEvent): void {
    this.mapData = $event;
    this.getNearby();
  }

  /**
   *
   */
  onSearch(searchOptions: SearchOptions): void {
    this.latestSearchOptions = searchOptions;
    this.appStore.setProperty('searchOptions', searchOptions);
    this.router.navigate(['search', searchOptions.query]);
  }

  /**
   *
   */
  onSectionSelected(endpoint: string): void {
    this.router.navigate([endpoint]);
  }

  /**
   *
   */
  onExternalLinkSelected(link: string): void {
    window.open(link, '_blank');
  }

  /**
   *
   */
  onSearchQueryChanged(query: string): void {
    // Do nothing
  }

  /**
   *
   */
  onSuggestionSelected(suggestion: PlaceSuggestion): void {
    this.currentLocation = suggestion.geo;
    this.updateCurrentLocationInStore();
  }

  /**
   *
   */
  onPoiSelected(entity: Poi): void {
    this.currentLocation = new GeoLocation(
      entity.coords.lat,
      entity.coords.lng,
      undefined,
      (entity as any).title || (entity as any).name,
    );
    this.updateCurrentLocationInStore();
  }

  /**
   *
   */
  onOptionsUpdated(searchOptions: SearchOptions): void {
    this.latestSearchOptions = searchOptions;
    this.getNearby();
  }

  /**
   *
   */
  onLanguageSelected(index: number): void {
    const lang = environment.i18n.availableLangs[index];

    I18nService.chosenUserLang = lang;
    PersistanceService.set('lang', lang);

    this.translate.use(lang);
    moment.locale(lang);

    this.onSectionSelected('/');
  }

  /**
   *
   */
  onEnableGeolocation(): void {
    if (!this.hasActivatedBrowserGeolocation) {
      this.registerMovementHandlers();
    } else {
      this.currentLocation = this.userLocation;

      this.updateUserLocationInStore();
      this.updateCurrentLocationInStore();
    }
  }

  /**
   *
   */
  closeSection(): void {
    this.router.navigate(['/']);
  }

  /**
   *
   */
  private bootstrap(): void {
    // First, let's retrieve some information about the user
    const sub$ = this.api.getUserInfo().subscribe((res: UserInfoResult) => {
      if (res.errors) {
        throw new Error('Something wrong happened loading the user info');
      }

      if (!res.loading) {
        this.userData = res.data.userInfo;

        this.initMomentI18n();
        this.registerMovementHandlers();

        sub$.unsubscribe();
      }
    });
  }

  /**
   *
   */
  private getNearby(): void {
    if (!this.mapData) {
      return;
    }

    this.isNearbyLoading = true;

    // Load OSM items only below a certain radius threshold
    if (this.mapData.radius < this.osmRadiusThreshold) {
      this.getOsmNearby();
    }

    if (this.nearbyQueryController) {
      this.nearbyQueryController.abort();
    }

    const { observable: getNearby, controller } = this.api.getNearbyCancelable({
      lng: this.mapData.coordinates[0],
      lat: this.mapData.coordinates[1],
      minWeather: (this.latestSearchOptions && this.latestSearchOptions.minWeather) || 0,
      maxWeather: (this.latestSearchOptions && this.latestSearchOptions.maxWeather) || 1,
      minPosition: (this.latestSearchOptions && this.latestSearchOptions.minPosition) || 0,
      maxPosition: (this.latestSearchOptions && this.latestSearchOptions.maxPosition) || 1,
      minDifficulty: (this.latestSearchOptions && this.latestSearchOptions.minDifficulty) || 0,
      maxDifficulty: (this.latestSearchOptions && this.latestSearchOptions.maxDifficulty) || 1,
      distance: this.mapData.radius,
    });

    this.nearbyQueryController = controller;

    const sub$ = getNearby.subscribe((res: NearbyResult) => {
      if (res.errors) {
        throw new Error('Something went wrong during the nearby query');
      }

      if (!res.loading) {
        this.isNearbyLoading = false;
        this.nearbyPois = res.data.nearby;
        sub$.unsubscribe();
      }
    });
  }

  /**
   *
   */
  private getOsmNearby(): void {
    if (!this.mapData) {
      return;
    }

    if (this.osmQueryController) {
      this.osmQueryController.abort();
    }

    this.isOsmNearbyLoading = true;

    const { observable: getOpenStreetMapNodes, controller } = this.api.getOpenStreetMapNodesCancelable({
      lng: this.mapData.coordinates[0],
      lat: this.mapData.coordinates[1],
      distance: this.mapData.radius,
    });

    this.osmQueryController = controller;

    const sub$ = getOpenStreetMapNodes.subscribe((res: { loading: boolean; data: Record<string, object> }) => {
      if (!res.loading) {
        if (!isEmpty(res.data) && !isEmpty(res.data.osmNodes)) {
          const { osmNodes: pois } = res.data;
          this.nearbyOsmPois = pois;
        }

        this.isOsmNearbyLoading = false;
        sub$.unsubscribe();
      }
    });
  }

  /**
   *
   */
  /*
  private getLatest(): void {
    this.isLatestLoading = true;

    const latestSubscription = this.api
      .getLatest({
        lng: this.currentLocation.lng,
        lat: this.currentLocation.lat,
      })
      .subscribe((res: LatestResult) => {
        if (res.errors) {
          throw new Error('Something went wrong during the nearby query');
        }

        if (!res.loading) {
          this.isLatestLoading = false;
          this.latestPois = res.data.latest;
          latestSubscription.unsubscribe();
        }
      });
  }
  */

  /**
   *
   */
  private updateCurrentLocationInStore(): void {
    this.appStore.setProperty('currentLocation', this.currentLocation);
  }

  /**
   *
   */
  private updateUserLocationInStore(): void {
    this.appStore.setProperty('currentUserLocation', this.userLocation);
  }

  /**
   *
   */
  private initMomentI18n(): void {
    moment.locale(I18nService.userLang);
    moment.tz.setDefault(this.userData.geo.timeZone);
  }

  /**
   *
   */
  private registerMovementHandlers(): void {
    /*
    We set the user location using the current one so the map is updated
    (note that it will trigger the "onMapUpdate" event)

    At first, we try to retrieve the position from the browser,
    in case of error or unapproved geolocation we use the position
    coming from the back-end.
    */
    const doUpdateLocations = (location: GeoLocation, storeCurrentLocation: boolean) => {
      if (storeCurrentLocation) {
        this.currentLocation = location;
        this.updateCurrentLocationInStore();
      }

      this.userLocation = location;
      this.updateUserLocationInStore();
    };

    this.geoService.watchLocationFromBrowser(
      (position) => {
        // success
        this.hasActivatedBrowserGeolocation = true;
        const newLocation = new GeoLocation(position.coords.latitude, position.coords.longitude, '');

        let updateCurrentLocation = false;

        if (!this.userLocation) {
          updateCurrentLocation = true;
        } else {
          if (this.mapData) {
            const deltaLocationDistance = this.geoService.getDistanceFromCoords(this.userLocation, newLocation);
            updateCurrentLocation = deltaLocationDistance > this.mapData.radius;
          }
        }

        doUpdateLocations(newLocation, updateCurrentLocation);
      },
      () => {
        // error (fallback using coords from the BE)
        const location = new GeoLocation(
          this.userData.geo.coords.lat,
          this.userData.geo.coords.lng,
          undefined,
          this.userData.geo.city,
        );

        doUpdateLocations(location, true);
      },
    );

    this.geoService.watchDeviceHorizontalOrientation(
      (orientation: number) => {
        this.currentOrientation = orientation ? Math.ceil(orientation) : this.currentOrientation;
      },
      () => {
        // Nothing to do, the feature is not supported by the device
        // TODO: Show a message?
      },
    );
  }
}
