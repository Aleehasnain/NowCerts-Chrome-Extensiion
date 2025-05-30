import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMappingListComponent } from './edit-mapping-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditMappingListComponent,
  },
  {
    path: 'edit/:id',
    component: EditMappingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditMappingListRoutingModule { }
