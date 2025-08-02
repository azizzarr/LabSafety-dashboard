import { NgModule } from '@angular/core';
import {NbMenuModule, NbTooltipModule} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import {ModalOverlaysModule} from './modal-overlays/modal-overlays.module';
// import {TooltipComponent} from './modal-overlays/tooltip/tooltip.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbTooltipModule,
 //  AppAlertModule,
  ],
  declarations: [
    PagesComponent,
   // TooltipComponent,
  ],
})
export class PagesModule {
}
