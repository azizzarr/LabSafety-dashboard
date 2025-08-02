import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { AuthService } from "../../../services/auth.services";
import {HttpResponse} from "@angular/common/http";
import { saveAs } from 'file-saver';
import {forkJoin, Observable, of, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Router} from "@angular/router";
import {Permission} from "../../../models/permission.model";
import {NbTooltipModule, NbWindowService} from '@nebular/theme';

import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
  NbTooltipComponent,
} from '@nebular/theme';
import {AlertService} from "../../../services/alert.service";
import {Alert} from "../../../models/Alert.model";
import {User} from "../../../models/user.model";
@Component({
  selector: 'ngx-alert-table',
  templateUrl: './alert-table.component.html',
  styleUrls: ['./alert-table.component.scss'],
})
export class AlertTableComponent implements OnInit {
  listAlerts: Alert[] = [];
  pagedAlerts: Alert[] = [];
  alerts: Alert[] = [];
  currentPage = 1;
  pageSize = 20;
  totalAlerts = 0;
  searchQuery: string = '';
  private searchTerm: string;
  private filteredUsers: any;
  userPermissions: Permission[] = [];
  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef, static: true }) disabledEscTemplate: TemplateRef<HTMLElement>;
  constructor(private alertService: AlertService, private authService: AuthService, private router: Router,
              private toastrService: NbToastrService,
  private windowService: NbWindowService) {}

  ngOnInit(): void {
    this.getAllAlert();
  }
  getAllAlert() {
    this.alertService.getAllAlertsFromDatabase().subscribe(res => {
      this.listAlerts = res as unknown as Alert[];
      this.listAlerts.forEach(alert => {
        if (typeof alert.timestamp === 'string') {
          const dateParts = alert.timestamp.split(',').map(part => parseInt(part, 10));
          alert.timestamp = new Date(dateParts[0], dateParts[1]
            - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
        }
        console.log('Converted Date:', alert.timestamp);
      });
      this.totalAlerts = this.listAlerts.length;
      this.updatePagedAlerts();
    });
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
  pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedAlerts();
  }

  updatePagedAlerts() {
    let filteredAlerts = this.listAlerts;

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      // Filter users based on search query
      const searchTerm = this.searchQuery.toLowerCase();
      filteredAlerts = this.listAlerts.filter(alert => {
        return (
          (alert.title && alert.title.toLowerCase().includes(searchTerm)) ||
          (alert.message && alert.message.toLowerCase().includes(searchTerm)) ||
          (alert.status && alert.status.toString().toLowerCase().includes(searchTerm)) ||
          (alert.demande && alert.demande.toString().toLowerCase().includes(searchTerm))
        );
      });
    }

    // Update pagedUsers
    this.totalAlerts = filteredAlerts.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalAlerts);
    this.pagedAlerts = filteredAlerts.slice(startIndex, endIndex);

    // Set 'last' for the last user
    if (this.pagedAlerts.length > 0) {
      this.pagedAlerts[this.pagedAlerts.length - 1].last = true;
    }

    // Reset 'last' for all other users
    for (let i = 0; i < this.pagedAlerts.length - 1; i++) {
      this.pagedAlerts[i].last = false;
    }

  }










  search() {
    console.log("Search Query:", this.searchQuery); // Add this line to check searchQuery value
    if (this.listAlerts.length > 0) { // Check if listUsers has data
      this.currentPage = 1;
      this.searchTerm = this.searchQuery.trim().toLowerCase(); // Update searchTerm
      this.updatePagedAlerts();
      this.showToast('danger', 'Success Title', 'Permission added successfully');
    }
  }

importFromExcel() {
  this.authService.importUsers('C:\\Users\\azizz\\Desktop\\springstage.xlsx').subscribe(
    response => {
      console.log('Users imported successfully:', response);
      this.showToast('success', 'Success Title', 'Permission added successfully');
    },
    error => {
      console.error('Failed to import users:', error);
    },
  );

}

  private getFilenameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    const matches = /filename="?([^"]+)"?;?/i.exec(contentDisposition);
    return matches && matches.length > 1 ? matches[1] : 'user_list.pdf';
  }
  displayedColumns: any;
  last: Boolean;


  downloadPdf(): void {
    this.authService.getPdf().subscribe(
      (response: HttpResponse<Blob>) => {
        this.downloadFile(response.body);
        this.showToast('success', 'Pdf file uploaded successfully', '');
      },
      (error) => {
        console.error('Failed to fetch PDF: ', error);
        // Handle error as needed
      },
    );
  }
  private downloadFile(blob: Blob): void {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'user_list.pdf'; // Adjust the file name if needed
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(url);
  }
  openWindowWithoutBackdrop() {
    this.windowService.open(
      this.contentTemplate,
      {
        title: 'Permission problem',
        hasBackdrop: false,
        closeOnEsc: false, // Add a custom class to the window
      },
    );
  }


  config: NbToastrConfig;

  index = 1;
  destroyByClick = true;
  duration = 6000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'primary';
  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? ` ${title}` : '';

    this.index += 1;
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Warning':
        return 'status-warning status-cell';
      case 'Danger':
        return 'status-danger status-cell';
      default:
        return 'status-normal status-cell';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Warning':
        return 'fa fa-exclamation-triangle status-icon';
      case 'Danger':
        return 'fa fa-times-circle status-icon';
      default:
        return 'fa fa-info-circle status-icon';
    }
  }

  validateAlert(id: number): void {
    this.alertService.validateAlert(id).subscribe(
      () => {
        // Update the demande value in the frontend
        const alert = this.listAlerts.find(alert => alert.id === id);
        if (alert) {
          alert.demande = 'validé';
        }
        this.showToast('success', 'Alert Validated', 'The alert has been validated successfully.');
        this.updatePagedAlerts();
      },
      error => {
        console.error('Failed to validate alert:', error);
        this.showToast('danger', 'Validation Failed', 'Failed to validate the alert.');
      }
    );
  }
  onRoleChange(event: any) {
    const Date = event.target.value; // Get the selected role name
    if (Date) {
      // Fetch users based on the selected role
      switch (Date) {
        case 'Today':
          this.alertService. getAlertsForToday().subscribe(alerts => {
            this.listAlerts = alerts as unknown as Alert[];
            this.updatePagedAlerts();
          });
          break;
        case 'Last Week':
          this.alertService.getAlertsForLastWeek().subscribe(alerts => {
            this.listAlerts = alerts as unknown as Alert[];
            this.updatePagedAlerts();
          });
          break;
        case 'Last Month':
          this.alertService.getAlertsForLastMonth().subscribe(alerts => {
            this.listAlerts = alerts as unknown as Alert[];
            this.updatePagedAlerts();
          });
          break;
        default:
          break;
      }
    }
  }


}
