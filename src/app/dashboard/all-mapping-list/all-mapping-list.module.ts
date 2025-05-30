import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AllMappingListRoutingModule } from './all-mapping-list-routing.module';
import { AllMappingListComponent } from './all-mapping-list.component';


@NgModule({
  declarations: [AllMappingListComponent],
  imports: [
    CommonModule,
    AllMappingListRoutingModule,
    FormsModule,
    MatIconModule,
    Ng2SearchPipeModule
  ],
})
export class AllMappingListModule {}
