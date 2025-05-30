import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllMappingListComponent } from './all-mapping-list.component';

const routes: Routes = [
  {
    path: '',
    component: AllMappingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllMappingListRoutingModule { }
