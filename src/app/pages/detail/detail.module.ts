import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { EllipsisModule } from 'ngx-ellipsis';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { MomentModule } from 'ngx-moment';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { DetailNearbyComponent } from 'src/app/components/detail-panel/detail-nearby/detail-nearby.component';
import { DetailPanelComponent } from 'src/app/components/detail-panel/detail-panel.component';
import { CompetitionCardItemComponent } from 'src/app/components/detail-panel/items/competition-item.component';
import { CragCardItemComponent } from 'src/app/components/detail-panel/items/crag-item.component';
import { HikeCardItemComponent } from 'src/app/components/detail-panel/items/hike-item.component';
import { PlaceCardItemComponent } from 'src/app/components/detail-panel/items/place-item.component';
import { PoiCardItemComponent } from 'src/app/components/detail-panel/items/poi-item.component';
import { ShelterCardItemComponent } from 'src/app/components/detail-panel/items/shelter-item.component';
import { SkyconComponent } from 'src/app/components/skycon/skycon.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { environment } from 'src/environments/environment';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { MatButtonModule } from '@angular/material/button';

const components = [
  DetailComponent,
  DetailPanelComponent,
  SkyconComponent,
  DetailNearbyComponent,
  CragCardItemComponent,
  HikeCardItemComponent,
  ShelterCardItemComponent,
  PlaceCardItemComponent,
  CompetitionCardItemComponent,
  PoiCardItemComponent,
];

const MaterialModules = [
  MatSidenavModule,
  MatChipsModule,
  MatIconModule,
  MatExpansionModule,
  MatListModule,
  MatProgressBarModule,
  MatChipsModule,
  MatButtonModule,
];

@NgModule({
  imports: [
    DetailRoutingModule,
    CommonModule,
    PerfectScrollbarModule,
    MomentModule,
    FlexLayoutModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.token,
    }),
    TranslateModule.forChild({
      isolate: false,
    }),
    PipesModule,
    EllipsisModule,
    ShareButtonsModule,
    ShareIconsModule,
    ...MaterialModules,
  ],
  exports: [],
  declarations: [...components],
  providers: [],
})
export class DetailModule {}
