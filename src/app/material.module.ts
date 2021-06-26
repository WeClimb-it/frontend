import { ObserversModule } from '@angular/cdk/observers';
import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Ng5SliderModule } from 'ng5-slider';

/**
 * NgModule that includes all Material modules that are required to serve the app.
 */
@NgModule({
  exports: [
    ObserversModule,
    PlatformModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSliderModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    Ng5SliderModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
})
export class MaterialModule {}
