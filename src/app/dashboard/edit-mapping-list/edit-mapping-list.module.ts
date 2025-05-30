import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditMappingListRoutingModule } from './edit-mapping-list-routing.module';
import { EditMappingListComponent } from './edit-mapping-list.component';

@NgModule({
  declarations: [EditMappingListComponent],
  imports: [
    CommonModule,
    EditMappingListRoutingModule,
    FormsModule,
    MatIconModule,
    Ng2SearchPipeModule,
  ],
})
export class EditMappingListModule {}
