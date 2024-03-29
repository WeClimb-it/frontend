import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Shelter } from 'src/app/interfaces/graphql';
import { GeoService } from 'src/app/services/geo.service';
import { MetaService } from 'src/app/services/meta.services';
import { WciApiService } from 'src/app/services/wciApi.service';
import { BaseItemWithDynamicMapComponent } from './+withDynamicMap-item.component';

@Component({
  selector: 'wci-shelter-card-item',
  templateUrl: 'shelter-item.component.html',
  styleUrls: ['shelter-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ShelterCardItemComponent extends BaseItemWithDynamicMapComponent implements OnChanges {
  data: Shelter;

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

  // TODO: This should be done on the BE
  get phoneNumbers(): string[] {
    if ((!this.data.phone && !this.data.mobile) || (this.data.phone === null && this.data.mobile === null)) {
      return [];
    }

    const rawPhones = (this.data.phone || this.data.mobile).replace(/[\s-\/]+/g, '').split(/[^\d+-/(/)]/gm);
    return rawPhones.filter((value: string) => value.length > 3);
  }
}
