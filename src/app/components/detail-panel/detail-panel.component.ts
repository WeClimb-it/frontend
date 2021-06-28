import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { GeoLocation } from 'src/app/classes/geolocation.class';
import { HistoryService } from 'src/app/services/history.service';
import { MetaService } from 'src/app/services/meta.services';
import { ContentType } from 'src/app/utils/ContentType';

@Component({
  selector: 'wci-detail-panel',
  templateUrl: 'detail-panel.component.html',
  styleUrls: ['./detail-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailPanelComponent implements OnChanges, OnDestroy {
  @Input() type: ContentType;
  @Input() data: Record<string, any>;
  @Input() currentLocation: GeoLocation;
  @Input() userLocation: GeoLocation;
  @Input() useMetricSystem = false;
  @Input() loading: boolean;
  @Input() errored: boolean;

  @ViewChild('scrollbar') scrollbar: PerfectScrollbarComponent;

  disableScrollbar = false;

  constructor(private historyService: HistoryService, private metaService: MetaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) {
      this.historyService.addToHistory(this.data);
    }
  }

  ngOnDestroy(): void {
    this.metaService.setDefaultSocialMeta();
  }
}
