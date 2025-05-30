import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingCategoriesRoutingModule } from './mapping-categories-routing.module';
import { MappingCategoriesComponent } from './mapping-categories.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    MappingCategoriesComponent
  ],
  imports: [
    CommonModule,
    MappingCategoriesRoutingModule,
    MatIconModule
  ]
})
export class MappingCategoriesModule { }
