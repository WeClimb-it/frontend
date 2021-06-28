import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Competition } from 'src/app/interfaces/graphql';
import { GeoService } from 'src/app/services/geo.service';
import { MetaService } from 'src/app/services/meta.services';
import { WciApiService } from 'src/app/services/wciApi.service';
import { getSanitizedCompetitionProperties } from 'src/app/utils/Misc';
import { BaseCardItemComponent } from './+base-item.component';

@Component({
  selector: 'wci-competition-card-item',
  templateUrl: 'competition-item.component.html',
  styleUrls: ['competition-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CompetitionCardItemComponent extends BaseCardItemComponent implements OnChanges {
  data: Competition;

  hasBeenDisputed = false;
  types = [];
  specialtiesAndCategories: string[] = [];
  startDate: Date;
  endDate: Date;

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

    if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
      const { disputed, types, specialtiesAndCategories, startDate, endDate } = getSanitizedCompetitionProperties(
        changes.data.currentValue,
      );

      this.hasBeenDisputed = disputed;
      this.types = types;
      this.specialtiesAndCategories = specialtiesAndCategories;
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }
}
