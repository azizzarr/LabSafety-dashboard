import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        component: ECommerceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'iot-dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'layout',
        loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'ui-features',
        loadChildren: () => import('./ui-features/ui-features.module').then(m => m.UiFeaturesModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'modal-overlays',
        loadChildren: () => import('./modal-overlays/modal-overlays.module').then(m => m.ModalOverlaysModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'extra-components',
        loadChildren: () => import('./extra-components/extra-components.module').then(m => m.ExtraComponentsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'editors',
        loadChildren: () => import('./editors/editors.module').then(m => m.EditorsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
