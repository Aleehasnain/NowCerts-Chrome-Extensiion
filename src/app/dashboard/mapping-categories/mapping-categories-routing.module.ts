import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappingCategoriesComponent } from './mapping-categories.component';

const routes: Routes = [
  {
    path: '',
    component: MappingCategoriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingCategoriesRoutingModule { }
