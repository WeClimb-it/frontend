import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GeoService } from 'src/app/services/geo.service';
import { MetaService } from 'src/app/services/meta.services';
import { WciApiService } from 'src/app/services/wciApi.service';
import { BaseItemWithDynamicMapComponent } from './+withDynamicMap-item.component';

@Component({
  selector: 'wci-poi-card-item',
  templateUrl: 'poi-item.component.html',
  styleUrls: ['poi-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PoiCardItemComponent extends BaseItemWithDynamicMapComponent implements OnChanges {
  data: Record<string, any>;

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
}
