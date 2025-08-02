import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import {DialogData} from '../../../../models/DialogData.model';

@Component({
  selector: 'ngx-workerchart-list',
  templateUrl: 'workerchart-list.component.html',
  styleUrls: ['workerchart-list.component.scss'],
})
export class WorkerchartListComponent implements OnInit {
  @Input() title: string;
  @Input() workers: any; // Add Input decorator for workers

  constructor(protected ref: NbDialogRef<WorkerchartListComponent>, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Workers in dialog:', this.workers); // Log the workers to check if they are received correctly
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  formatDate(dateArray: number[]): string {
    // Ensure that dateArray has at least 6 elements
    if (dateArray.length < 6) {
      return 'Invalid date format';
    }

    const year = dateArray[0];
    const month = String(dateArray[1]).padStart(2, '0');
    const day = String(dateArray[2]).padStart(2, '0');
    const hours = String(dateArray[3]).padStart(2, '0');
    const minutes = String(dateArray[4]).padStart(2, '0');
    const seconds = String(dateArray[5]).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
  dismiss() {
    this.ref.close();
  }
}

