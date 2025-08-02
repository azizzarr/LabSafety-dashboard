import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { WorkersService } from '../../../services/workers.service';
import { Worker } from '../../../models/worker.model';
import { Poste } from '../../../models/Poste.model';
import { ServiceWork } from '../../../models/ServiceWork.model';
import * as moment from 'moment';
import {WorkerDetailsComponent} from '../../modal-overlays/dialog/Worker_Details/worker-details.component';
import {NbDialogService} from "@nebular/theme";
import {ComparitionBarComponent} from "../../modal-overlays/dialog/Worker_Details/comparition-bar.component";

@Component({
  selector: 'ngx-workers-table',
  templateUrl: './workers-table.component.html',
  styleUrls: ['./workers-table.component.scss'],
})
export class WorkersTableComponent implements OnInit, AfterViewInit {
  @ViewChild('addButton') addButton: ElementRef;
  public selectedPoste: string;
  public settings: any;
  public postes: Poste[] = [];
  public services: ServiceWork[] = [];
  public postesLoaded: boolean = false;
  public servicesLoaded: boolean = false;
  posteName: string = '';

  constructor(private workerService: WorkersService, private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.getAllWorkers();
    this.workerService.getPostes().subscribe(
      (response: Poste[]) => {
        this.postes = response;
        this.postesLoaded = true;
        this.initSettings();
      },
      (error) => {
        console.log(error);
      }
    );
    this.workerService.getService().subscribe(
      (response: ServiceWork[]) => {
        this.services = response;
        this.servicesLoaded = true;
        this.initSettings();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.initSettings();
  }

  initSettings(): void {
    this.settings = {
      add: {
        addButtonContent: '<div class="nb-plus" id="addButton"></div>',
        createButtonContent: '<i class="nb-checkmark add"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
       confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      custom: {
        customButtonContent: '<i class="nb-gear"></i>',
        customConfirm: true,
      },
      columns: {
        matricule: {
          title: 'Matricule',
          type: 'string',
        },
        nom: {
          title: 'Nom',
          type: 'string',
        },
        prenom: {
          title: 'Prenom',
          type: 'string',
        },
        poste: {
          title: 'Poste',
          type: 'html',
          editor: {
            type: 'list',
            config: {
              list: this.postes.map(poste => ({ value: poste.name, title: poste.name })),
            },
          },
          valuePrepareFunction: (cell, row) => {
            if (row.postes && row.postes.length > 0) {
              return row.postes.map(poste => poste.name).join(', ');
            } else {
              return '';
            }
          },
          onChange: (event) => {
            console.log('Selected poste name:', event.newValue);
          }
        },
        service: {
          title: 'Service',
          type: 'html',
          editor: {
            type: 'list',
            config: {
              list: this.services.map(service => ({ value: service.name, title: service.name })),
            },
          },
          valuePrepareFunction: (cell, row) => {
            if (row.services && row.services.length > 0) {
              return row.services.map(service => service.name).join(', ');
            } else {
              return '';
            }
          },
          onChange: (event) => {
            console.log('Selected service name:', event.newValue);
          }
        },
        email: {
          title: 'E-mail',
          type: 'string',
        },
        date: {
          title: 'Date',
          type: 'custom',
          renderComponent: DatePickerComponent,
          valuePrepareFunction: (date) => {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
          }
        },
        chargeEsd: {
          title: 'Charge Esd',
          type: 'number',
        },
      },
    };
  }

  source: LocalDataSource = new LocalDataSource();

  getAllWorkers(): void {
    this.workerService.getAllWorkers().subscribe((workers: Worker[]) => {
      this.source.load(workers);
    });
  }

  addWorker(worker: Worker): void {
    console.log('addWorker method called');
    if (worker.postes && worker.postes.length > 0) {
      console.log('Chosen Poste:', worker.postes[0].name);
    } else {
      console.log('No poste chosen for the worker');
    }

    this.workerService.addWorker(worker).subscribe(
      (newWorker: Worker) => {
        console.log('New worker added:', newWorker);
        this.getAllWorkers();
      },
      (error) => {
        console.error('Error adding worker:', error);
      }
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {
    console.log('onCreateConfirm method called');
    const newWorker: Worker = event.newData;

    newWorker.matricule = 'G-' + newWorker.matricule;
    newWorker.postes = [{ name: event.newData.poste }];
    newWorker.services = [{ name: event.newData.service }];
    newWorker.date = event.newData.date; // Assign the selected date from the date picker

    if (window.confirm('Are you sure you want to create?')) {
      this.addWorker(newWorker);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  test(): void {
    console.log('test method called');
  }

 /* onCustomAction(event): void {
    console.log('Custom button clicked', event);
  }*/

  onPosteSelectionChange(event): void {
    console.log('Selected poste:', event.data);
  }

  addPoste(): void {
    const newPoste: Poste = { name: this.posteName as any };
    this.workerService.addPoste(newPoste).subscribe(
      (createdPoste) => {
        console.log('Poste created successfully:', createdPoste);
        this.posteName = '';
      },
      (error) => {
        console.error('Error creating poste:', error);
      }
    );
  }
  onCustomAction(event): void {
    if (event.action === 'view') {
      const selectedWorker = event.data; // Get the selected worker data
      this.open(selectedWorker);
    }
  }

  onRowSelect(event): void {
    const selectedWorker: Worker = event.data; // Get the selected worker data
    this.open(selectedWorker);
  }

  open(selectedWorker: Worker): void {
    const matricule = selectedWorker.matricule; // Extract matricule
    console.log('Open method called with selected matricule:', matricule);

    this.dialogService.open(WorkerDetailsComponent, {
      context: {
        title: 'Worker Details',
        matricule: matricule, // Pass matricule as @Input
      },
    });
  }






}

// Custom DatePickerComponent
@Component({
  selector: 'ngx-date-picker',
  template: `
    <input
      [value]="value"
      (input)="onInputChange($event)"
      type="datetime-local"
      class="form-control"
    />
  `,
})
export class DatePickerComponent {
  @Input() value: string | null;

  onInputChange(event: any): void {
    this.value = event.target.value;
  }
}
