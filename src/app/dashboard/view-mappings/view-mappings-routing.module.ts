import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMappingsComponent } from './view-mappings.component';

const routes: Routes = [
  {
    path: '',
    component: ViewMappingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMappingsRoutingModule { }
