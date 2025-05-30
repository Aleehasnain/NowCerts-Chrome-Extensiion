import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DestroyGuard } from './guards/destroy.guard';
import { Page404Component } from './page404/page404.component';
import { PopupguardGuard } from './guards/popupguard.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [DestroyGuard,PopupguardGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'listing',
    loadChildren: () =>
      import('./listing/listing.module').then((m) => m.ListingModule),
  },
  {
    path: '404',
    component: Page404Component,
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }, // redirect to `404 page`, a Wildcard route for a 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
