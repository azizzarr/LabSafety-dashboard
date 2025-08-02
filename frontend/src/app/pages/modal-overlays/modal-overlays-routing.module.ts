import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalOverlaysComponent } from './modal-overlays.component';
import { DialogComponent } from './dialog/dialog.component';
import { WindowComponent } from './window/window.component';
import { PopoversComponent } from './popovers/popovers.component';
import { ToastrComponent } from './toastr/toastr.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import {WorkerDetailsComponent} from './dialog/Worker_Details/worker-details.component';
import {ShowcaseDialogComponent} from "./dialog/showcase-dialog/showcase-dialog.component";
import {WorkerchartListComponent} from "./dialog/Worker_Chart_List/workerchart-list.component";

const routes: Routes = [{
  path: '',
  component: ModalOverlaysComponent,
  children: [
    {
      path: 'dialog',
      component: DialogComponent,
    },
    {
      path: 'window',
      component: WindowComponent,
    },
    {
      path: 'popover',
      component: PopoversComponent,
    },
    {
      path: 'tooltip',
      component: TooltipComponent,
    },
    {
      path: 'toastr',
      component: ToastrComponent,
    },
    {
      path: 'ngx-worker-details',
      component: WorkerDetailsComponent,
    },
    {
      path: 'ngx-showcase-dialog',
      component: ShowcaseDialogComponent,
    },
    {
      path: 'ngx-workerchart-list',
      component: WorkerchartListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalOverlaysRoutingModule {
}


