import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListViewRoutingModule } from './list-view-routing.module';
import { ListViewComponent } from './list-view.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ListViewComponent],
  imports: [
    CommonModule,
    ListViewRoutingModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
  ],
})
export class ListViewModule {}
