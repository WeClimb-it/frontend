import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PoliciesRoutingModule } from './policies-routing.module';
import { PoliciesComponent } from './policies.component';

@NgModule({
  imports: [PoliciesRoutingModule, CommonModule, PerfectScrollbarModule],
  exports: [],
  declarations: [PoliciesComponent],
  providers: [],
})
export class PoliciesModule {}
