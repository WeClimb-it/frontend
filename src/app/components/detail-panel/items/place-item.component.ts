import { AfterViewChecked, ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Place } from 'src/app/interfaces/graphql';
import { GeoService } from 'src/app/services/geo.service';
import { MetaService } from 'src/app/services/meta.services';
import { WciApiService } from 'src/app/services/wciApi.service';
import { BaseCardItemComponent } from './+base-item.component';

// tslint:disable-next-line: no-string-literal
const FB = window['FB'] || {};

@Component({
  selector: 'wci-place-card-item',
  templateUrl: 'place-item.component.html',
  styleUrls: ['place-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PlaceCardItemComponent extends BaseCardItemComponent implements AfterViewChecked, OnChanges {
  data: Place;

  constructor(
    protected router: Router,
    protected api: WciApiService,
    protected geoService: GeoService,
    protected metaService: MetaService,
  ) {
    super(router, api, geoService, metaService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }

  // TODO: This might be done only once, do it :-D
  ngAfterViewChecked(): void {
    if (FB && FB.XFBML) {
      FB.XFBML.parse();
    }
  }
}
