import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RecheckedGuard } from '../guards/rechecked.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./landing/landing.module').then((m) => m.LandingModule),
        canActivate: [RecheckedGuard],
      },
      {
        path: 'landing',
        loadChildren: () =>
          import('./landing/landing.module').then((m) => m.LandingModule),
      },
      {
        path: 'mapping',
        loadChildren: () =>
          import('./mapping/mapping.module').then((m) => m.MappingModule),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./list-view/list-view.module').then((m) => m.ListViewModule),
      },
      {
        path:'mapping-categories',
        loadChildren: ()=> import('./mapping-categories/mapping-categories.module').then((m)=> m.MappingCategoriesModule)
      },
      {
        path:'view-mappings',
        loadChildren: ()=> import('./view-mappings/view-mappings.module').then((m)=> m.ViewMappingsModule)
      },
      {
        path:'requests',
        loadChildren: ()=> import('./requests/requests.module').then((m)=> m.RequestsModule)
      },
      {
        path:'all-mapping',
        loadChildren: ()=> import('./all-mapping-list/all-mapping-list.module').then((m)=> m.AllMappingListModule)
      },
      {
        path:'edit-mapping',
        loadChildren: ()=> import('./edit-mapping-list/edit-mapping-list.module').then((m)=> m.EditMappingListModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
