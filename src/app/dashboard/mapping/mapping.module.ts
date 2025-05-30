import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingRoutingModule } from './mapping-routing.module';
import { MappingComponent } from './mapping.component';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AddMappingComponent } from './add-mapping/add-mapping.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    MappingComponent,
    AddMappingComponent
  ],
  imports: [
    CommonModule,
    MappingRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class MappingModule { }
