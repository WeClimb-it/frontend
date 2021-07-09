import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/components/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { environment } from 'src/environments/environment';
import { StoryRoutingModule } from './story-routing.module';
import { StoryComponent } from './story.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    PerfectScrollbarModule,
    SharedModule,
    StoryRoutingModule,
    TranslateModule.forChild({
      isolate: false,
    }),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.token,
    }),
  ],
  exports: [],
  declarations: [StoryComponent],
  providers: [],
})
export class StoryModule {}
