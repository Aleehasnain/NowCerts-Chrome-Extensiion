import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingRoutingModule } from './listing-routing.module';
import { ListingComponent } from './listing.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ListingComponent],
  imports: [CommonModule, ListingRoutingModule, FormsModule, MatIconModule],
})
export class ListingModule {}
