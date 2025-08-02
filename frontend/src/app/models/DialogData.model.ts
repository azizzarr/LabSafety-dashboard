import { Worker } from '../models/worker.model';

export interface DialogData {
  title: string;
  selectedDate: string;
  workers: Worker[];
}
