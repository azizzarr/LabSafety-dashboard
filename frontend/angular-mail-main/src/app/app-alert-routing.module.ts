import { NgModule } from '@angular/core';
import { Routes, RouterModule, } from '@angular/router';
import { EmailDetailsComponent } from './pages-alert/email-details/email-details.component';
import { EmailListComponent } from './pages-alert/email-list/email-list.component';
import { HomeComponent } from './pages-alert/home/home.component';
import { EmailAppComponent } from './pages-alert/email-app/email-app.component';
import { EmailResolver } from './services-alert/email.resolver';
// import { TabResolver } from './services/tab.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'email', component: EmailAppComponent, children: [
      { path: '', redirectTo: 'Alerts', pathMatch: 'full' },
      { path: 'label/:labelName/:id', component: EmailDetailsComponent, resolve: { email: EmailResolver } },
      { path: 'label/:labelName', component: EmailListComponent },
      { path: ':tab', component: EmailListComponent },
      { path: ':tab/:id', component: EmailDetailsComponent, resolve: { email: EmailResolver } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppAlertRoutingModule { }

