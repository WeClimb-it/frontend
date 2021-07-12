import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { StoryRoutingModule } from './story-routing.module';
import { StoryComponent } from './story.component';

const MaterialModules = [MatIconModule, MatButtonModule];

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    PerfectScrollbarModule,
    SharedModule,
    StoryRoutingModule,
    TranslateModule.forChild({
      isolate: false,
    }),
    ...MaterialModules,
  ],
  exports: [],
  declarations: [StoryComponent],
  providers: [],
})
export class StoryModule {}
