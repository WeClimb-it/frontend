import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { GeoLocation } from 'src/app/classes/geolocation.class';
import { NearbyResult } from 'src/app/graphql/queries';
import { Coords } from 'src/app/interfaces/graphql';
import { GeoService } from 'src/app/services/geo.service';
import { MetaService } from 'src/app/services/meta.services';
import { WciApiService } from 'src/app/services/wciApi.service';
import { getSectionFromItem } from 'src/app/utils/ContentType';
import { getGoogleMapsUrl } from 'src/app/utils/Map';
import { Poi } from 'src/app/utils/Poi';

@Component({
  selector: 'wci-base-card-item',
  template: '<div></div>',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BaseCardItemComponent implements OnChanges {
  @Input() data: Poi;
  @Input() currentLocation: GeoLocation;
  @Input() userLocation: GeoLocation;
  @Input() useMetricSystem = true;

  @ViewChild('sideScrollbar') scrollbar: PerfectScrollbarComponent;

  staticMapSrc = '';
  shareableDescr = '';

  expandDescription = false;

  nearbyPois: Poi[] = [];
  // photos: Photo[] = [];

  private nearbyItemsNumber = 4;
  private nearbyItemsDistance = 80;

  constructor(
    protected router: Router,
    protected api: WciApiService,
    protected geoService: GeoService,
    protected metaService: MetaService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue && changes.data.currentValue !== changes.data.previousValue) {
      this.staticMapSrc = this.geoService.getStaticMapUrl(this.data.coords, 360, 280);
      this.getNearby();

      this.shareableDescr = `${this.data['name'] || this.data['title'] || 'WeClimb.it'} @ ${this.data.coords.lat}, ${
        this.data.coords.lng
      }`;

      // TODO: i18n
      this.metaService.setDetailSocialMedia('Check this content on WeClimb.it', this.shareableDescr, location.href);
    }
  }

  /**
   *
   */
  goToDetailUrl(item: Poi) {
    const section = getSectionFromItem(item);
    this.router.navigate([section, item.slug]);
  }

  /**
   *
   */
  goToGoogle(coords: Coords): void {
    window.open(getGoogleMapsUrl(coords, this.userLocation.toCoordinatesObject()));
  }

  /**
   *
   */
  getNearby(): void {
    if (this.data.coords && this.data.coords.lat && this.data.coords.lng) {
      const sub$ = this.api
        .getNearbyCancelable({
          lat: this.data.coords.lat,
          lng: this.data.coords.lng,
          distance: this.nearbyItemsDistance,
          start: 0,
          end: this.nearbyItemsNumber,
        })
        .observable.subscribe((res: NearbyResult) => {
          if (!res.errors) {
            this.nearbyPois = [...res.data.nearby.crags, ...res.data.nearby.hikes, ...res.data.nearby.shelters].filter(
              (poi: Poi) => poi.slug !== this.data.slug,
            );
          }
          sub$.unsubscribe();
        });
    }
  }

  /**
   * TODO: Waiting to have useful photos in the DB
   */
  /*
  getPhotos(query: string): void {
    const sub$ = this.api.getPhotos({ query }).subscribe((res: PhotosResult) => {
      if (!res.errors) {
        this.photos = res.data.photos;
        console.log(res.data.photos);
      }
      sub$.unsubscribe();
    });
  }
  */
}
