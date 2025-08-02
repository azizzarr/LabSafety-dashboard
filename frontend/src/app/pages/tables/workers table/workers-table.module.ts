// workers-table.module.ts

import { NgModule } from '@angular/core';
import {DatePickerComponent, WorkersTableComponent} from './workers-table.component';
import {NbCardModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [WorkersTableComponent, DatePickerComponent],
  exports: [WorkersTableComponent],
    imports: [
        NbCardModule,
        Ng2SmartTableModule,
        CommonModule,
        FormsModule,
    ],
  // Export the component if you intend to use it in other modules
})
export class WorkersTableModule {}
