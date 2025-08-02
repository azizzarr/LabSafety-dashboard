import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { TreeGridComponent } from './tree-grid/tree-grid.component';
import {WorkersTableComponent} from './workers table/workers-table.component';
import {AlertTableComponent} from './alert-table/alert-table.component';
import {HistoriqueTableComponent} from "./historique-table/historique-table.component";

const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [
    {
      path: 'smart-table',
      component: SmartTableComponent,
    },
    {
      path: 'tree-grid',
      component: TreeGridComponent,
    },
    {
      path: 'ngx-workers-table',
      component: WorkersTableComponent,
    },
    {
      path: 'ngx-alert-table',
      component: AlertTableComponent,
    },
    {
      path: 'ngx-historique-table',
      component: HistoriqueTableComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  TablesComponent,
  SmartTableComponent,
  TreeGridComponent,
];
