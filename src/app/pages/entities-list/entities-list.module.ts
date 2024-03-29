import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CompetitionListItemComponent } from 'src/app/components/list-items/competition-item.component';
import { CragListItemComponent } from 'src/app/components/list-items/crag-item.component';
import { HikeListItemComponent } from 'src/app/components/list-items/hike-item.component';
import { NewsListItemComponent } from 'src/app/components/list-items/news-item.component';
import { PlaceListItemComponent } from 'src/app/components/list-items/place-item.component';
import { ShelterListItemComponent } from 'src/app/components/list-items/shelter-item.component';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { EntitiesListRoutingModule } from './entities-list-routing.module';
import { EntitiesListComponent } from './entities-list.component';

const components = [
  EntitiesListComponent,
  CragListItemComponent,
  HikeListItemComponent,
  ShelterListItemComponent,
  PlaceListItemComponent,
  CompetitionListItemComponent,
  NewsListItemComponent,
];

const MaterialModules = [
  MatChipsModule,
  MatIconModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatButtonModule,
  MatDialogModule,
];

@NgModule({
  imports: [
    EntitiesListRoutingModule,
    CommonModule,
    PerfectScrollbarModule,
    MomentModule,
    FlexLayoutModule,
    TranslateModule.forChild({
      isolate: false,
    }),
    PipesModule,
    SharedModule,
    ...MaterialModules,
  ],
  exports: [],
  declarations: [...components],
  providers: [],
})
export class EntitiesListModule {}
