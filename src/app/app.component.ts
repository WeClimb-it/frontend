import { Location } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SocialUser } from 'angularx-social-login';
import { debounce, isEmpty, isEqual } from 'lodash';
import moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeoLocation } from './classes/geolocation.class';
import { SearchOptions } from './components/header/header.component';
import { MapComponent } from './components/map/map.component';
import { NearbyResult, UserInfoResult } from './graphql/queries';
import { MapUpdateEvent } from './interfaces/events/map-update.interface';
import { ListResult, SearchResult, UserInfo, UserInfoInput } from './interfaces/graphql';
import { AppStoreService } from './services/appState.service';
import { GeoService, PlaceSuggestion } from './services/geo.service';
import { HistoryService } from './services/history.service';
import { I18nService } from './services/i18n.service';
import { MetaService } from './services/meta.services';
import { PersistanceService } from './services/persistanceService';
import { WciApiService } from './services/wciApi.service';
import { Poi } from './utils/Poi';

@Component({
  selector: 'wci-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('mapInstance') mapInstance: MapComponent;

  zoom = 11;
  year = new Date().getFullYear();

  hasBrowserGeolocation = navigator && navigator.geolocation;
  hasActivatedBrowserGeolocation = false;
  invalidateSharedPosition = false;
  currentLocation: GeoLocation = new GeoLocation(0, 0);
  currentOrientation: number | undefined;
  useMetricSystem = true;
  userLocation: GeoLocation;
  urlLocation: GeoLocation;
  nearbyPois: SearchResult;
  nearbyOsmPois: object;
  nearbyGooglePlacesPois: object;
  // latestPois: SearchResult;

  showContent = false;
  isFloatingContent = false;
  isArticle = false;
  isNearbyLoading = true;
  isOsmNearbyLoading = true;
  isGooglePlacesNearbyLoading = true;
  // isLatestLoading = true;

  environment = environment;

  user: UserInfo;
  userProfilePictureUrl: string;

  historyItems: Poi[] = [];

  private mapData: MapUpdateEvent;
  private userData: UserInfo;
  private latestSearchOptions: SearchOptions;

  private nearbyQueryController: AbortController;
  private osmQueryController: AbortController;
  private googlePlacesQueryController: AbortController;

  // miles
  private osmRadiusThreshold = 137;

  // ms
  private mapInteractionDebounceTime = 250;

  private subs$: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private api: WciApiService,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: Location,
    private appStore: AppStoreService,
    private cdr: ChangeDetectorRef,
    private historyService: HistoryService,
    private metaService: MetaService,
    public geoService: GeoService,
  ) {
    this.subs$.push(
      this.router.events.subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.showContent = !!this.route.root.firstChild.snapshot.data.type;
          this.isFloatingContent = this.route.root.firstChild.snapshot.data.isFloatingContent;
          this.isArticle = this.route.root.firstChild.snapshot.data.isArticle;
          this.handleShareableMapPosition();
        }
      }),

      this.appStore.watchProperty('currentLocation').subscribe((location: GeoLocation) => {
        if (location && !isEqual(location, this.currentLocation)) {
          this.currentLocation = location;
          // this.getLatest();
          this.getNearby();
        }
      }),

      this.appStore.watchProperty('currentUserLocation').subscribe((location: GeoLocation) => {
        if (location && !isEqual(location, this.userLocation)) {
          this.userLocation = location;
        }
      }),

      this.appStore.watchProperty('wciUser').subscribe((user: UserInfo) => {
        this.user = user;
      }),

      this.appStore.watchProperty('socialUserPicture').subscribe((url: string) => {
        this.userProfilePictureUrl = url;
      }),

      this.appStore.watchProperty('useMetricSystem').subscribe((flag: boolean) => {
        this.useMetricSystem = flag;
      }),

      this.appStore.watchProperty('history').subscribe((items: Poi[]) => {
        this.historyItems = items?.reverse() || [];
      }),
    );

    this.onMapReady = debounce(this.onMapReady, this.mapInteractionDebounceTime);
    this.onMapUpdate = debounce(this.onMapUpdate, this.mapInteractionDebounceTime);

    this.metaService.setDefaultSocialMeta();
  }

  ngOnInit(): void {
    this.registerAnalytics();
    this.gatherUserInfoAndRegisterDeviceLocationHandlers();
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub$) => sub$.unsubscribe());
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  /**
   *
   */
  onMapReady($event: MapUpdateEvent): void {
    this.onMapDataChanged($event);
  }

  /**
   *
   */
  onMapUpdate($event: MapUpdateEvent): void {
    this.onMapDataChanged($event);
    this.updateShareableURL(new GeoLocation($event.coordinates[1], $event.coordinates[0]));
  }

  private onMapDataChanged($event: MapUpdateEvent): void {
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
  // onSearchQueryChanged(query: string): void {
  //   // Do nothing
  // }

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
      this.registerDeviceMovementAndBrowserLocationHandlers();
    } else {
      if (isEqual(this.currentLocation, this.userLocation)) {
        if (this.mapInstance && this.userLocation.lat && this.userLocation.lng) {
          this.mapInstance.flyTo(this.userLocation.lat, this.userLocation.lng);
        }
      } else {
        this.currentLocation = this.userLocation;
        this.updateUserLocationInStore();
        this.updateCurrentLocationInStore();
      }
    }
  }

  /**
   *
   */
  onUserLoggedIn(user: SocialUser): void {
    this.appStore.setProperty('socialUserId', user.id);
    this.appStore.setProperty('socialUserToken', user.authToken);
    this.appStore.setProperty('socialUserPicture', user.photoUrl);

    const userInfoInput: UserInfoInput = {
      socialId: user.id,
      socialConnection: 'FB',
      firstName: user.firstName,
      lastName: user.lastName,
    };

    this.api
      .waveUser({
        user: userInfoInput,
      })
      .subscribe((res) => {
        this.appStore.setProperty('wciUser', res.data.waveUser);
      });
  }

  /**
   *
   */
  onUserLoggedOut(): void {
    this.appStore.unsetProperty('socialUserId');
    this.appStore.unsetProperty('socialUserToken');
    this.appStore.unsetProperty('socialUserPicture');
    this.appStore.unsetProperty('wciUser');
  }

  /**
   *
   */
  onUnitMeasureChanged(): void {
    this.appStore.setProperty('useMetricSystem', !this.useMetricSystem, true);
  }

  /**
   *
   */
  onClearHistory(): void {
    this.historyService.clear();
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
  private handleShareableMapPosition() {
    const localTempMapCenter = PersistanceService.get('tempMapCenter');
    let latLngStr = '';
    let setGracefully = true;

    if (localTempMapCenter) {
      latLngStr = localTempMapCenter as string;
      PersistanceService.unset('tempMapCenter');
      setGracefully = false;
    } else {
      const urlParts = window.location.href.split('/');
      latLngStr = urlParts[urlParts.length - 1];
    }

    const latLng = latLngStr.split(',');
    const lat = +latLng[0];
    const lng = +latLng[1];

    if (!isNaN(lat) && !isNaN(lng)) {
      const newGeoLoc = new GeoLocation(lat, lng);
      if (setGracefully) {
        this.urlLocation = newGeoLoc;
      } else {
        this.currentLocation = newGeoLoc;
      }
    }
  }

  /**
   *
   */
  private gatherUserInfoAndRegisterDeviceLocationHandlers() {
    const sub$ = this.api.getUserInfo().subscribe((res: UserInfoResult) => {
      if (res.errors) {
        throw new Error('Something wrong happened loading the user info');
      }

      if (!res.loading) {
        this.userData = res.data.userInfo;

        this.initMomentI18n();
        this.registerDeviceMovementAndBrowserLocationHandlers();

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

    this.getGooglePlacesNearby();

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
  private getGooglePlacesNearby(): void {
    if (!this.mapData) {
      return;
    }

    if (this.googlePlacesQueryController) {
      this.googlePlacesQueryController.abort();
    }

    this.isGooglePlacesNearbyLoading = true;

    const { observable: getGooglePlaces, controller } = this.api.getGooglePlacesCancelable({
      lng: this.mapData.coordinates[0],
      lat: this.mapData.coordinates[1],
      distance: this.mapData.radius,
    });

    this.googlePlacesQueryController = controller;

    const sub$ = getGooglePlaces.subscribe((res: { loading: boolean; data: Record<string, ListResult> }) => {
      if (!res.loading) {
        if (!isEmpty(res.data) && !isEmpty(res.data.googlePlaces)) {
          const { googlePlaces } = res.data;
          this.nearbyGooglePlacesPois = googlePlaces.items;
        }

        this.isGooglePlacesNearbyLoading = false;
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
    this.updateShareableURL(this.currentLocation);
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
    moment.tz.setDefault(this.userData.userGeo.timeZone);
  }

  /**
   *
   */
  private registerDeviceMovementAndBrowserLocationHandlers(): void {
    /*
    We set the user location using the current one so the map is updated
    (note that it will trigger the "onMapUpdate" event)

    At first, we try to retrieve the position from the browser,
    in case of error or unapproved geolocation we use the position
    coming from the back-end.
    */
    const doUpdateLocations = (location: GeoLocation, storeCurrentLocation: boolean) => {
      // Use the position coming from the URL if not set yet and available.
      if (!this.invalidateSharedPosition && this.urlLocation) {
        location = this.urlLocation;
        this.invalidateSharedPosition = true;
      }

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
          // Update the current location (following the user) only if it's in the visible portion of the map.
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
          this.userData.userGeo.coords.lat,
          this.userData.userGeo.coords.lng,
          undefined,
          this.userData.userGeo.city,
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

  /**
   *
   *
   */
  private registerAnalytics(): void {
    if (environment.production) {
      document.write(`
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', '${new Date()}');
  gtag('config', '${environment.googleAnalyticsID}');
</script>`);
    }
  }

  /**
   *
   */
  private updateShareableURL(geo: GeoLocation): void {
    // By design the shareable URL is supported only on the root level of the app,
    // data.type defines the section we are in.
    if (!this.route.root.firstChild?.snapshot.data.type) {
      this.locationService.go(`/${geo.lat.toFixed(4)},${geo.lng.toFixed(4)}`);
    }
  }
}
