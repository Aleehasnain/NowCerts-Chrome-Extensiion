import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMappingsRoutingModule } from './view-mappings-routing.module';
import { ViewMappingsComponent } from './view-mappings.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    ViewMappingsComponent
  ],
  imports: [
    CommonModule,
    ViewMappingsRoutingModule,
    FormsModule,
    MatIconModule,
    Ng2SearchPipeModule
  ]
})
export class ViewMappingsModule { }
