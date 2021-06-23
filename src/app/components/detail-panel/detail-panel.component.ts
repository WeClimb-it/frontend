import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { GeoLocation } from 'src/app/classes/geolocation.class';
import { ContentType } from 'src/app/utils/ContentType';
import { Poi } from 'src/app/utils/Poi';

@Component({
  selector: 'wci-detail-panel',
  templateUrl: 'detail-panel.component.html',
  styleUrls: ['./detail-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailPanelComponent {
  @Input() type: ContentType;
  @Input() data: Poi;
  @Input() currentLocation: GeoLocation;
  @Input() userLocation: GeoLocation;
  @Input() useMetricSystem = false;
  @Input() loading: boolean;
  @Input() errored: boolean;

  @ViewChild('scrollbar') scrollbar: PerfectScrollbarComponent;

  disableScrollbar = false;
}
