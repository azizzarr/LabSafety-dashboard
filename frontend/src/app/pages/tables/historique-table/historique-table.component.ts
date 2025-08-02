import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from "../../../services/auth.services";
import { Router } from "@angular/router";
import { NbWindowService, NbToastrService, NbComponentStatus,
  NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig } from '@nebular/theme';
import { AuditLog } from '../../../models/audit-log.model';
import { AuditlogService } from '../../../services/auditlog.service';
import { Page } from "../../../models/page.model";

@Component({
  selector: 'ngx-historique-table',
  templateUrl: './historique-table.component.html',
  styleUrls: ['./historique-table.component.scss'],
})
export class HistoriqueTableComponent implements OnInit {
  listLogs: AuditLog[] = [];
  pagedLogs: AuditLog[] = [];
  auditLogs: AuditLog[] = [];
  filters: { type: string, values: string[] }[] = [
    { type: 'CRUD', values: ['ADD', 'DELETE', 'UPDATE', 'Email Reset Password'] },
    { type: 'Access', values: ['Login', 'Logout', 'Sign Up'] },
    { type: 'Assign Permission', values: ['Write Permission', 'Delete Permission', 'Read Permission', 'Update Permission', 'Import Permission'] },
    { type: 'Validation de changement des chaussures', values: ['Validation'] },
  ];
  selectedFilters: { allFilters: string[] } = {
    allFilters: [],
  };
  currentPage = 1;
  pageSize = 20;
  totalLogs = 0;
  searchQuery: string = '';
  private searchTerm: string;
  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef, static: true }) disabledEscTemplate: TemplateRef<HTMLElement>;

  constructor(private auditlogService: AuditlogService, private authService: AuthService, private router: Router,
              private toastrService: NbToastrService, private windowService: NbWindowService) {}

  ngOnInit(): void {
    this.fetchAuditLogs();
  }

  formatDate(dateArray: number[]): string {
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

  fetchAuditLogs(startDate?: string, endDate?: string,
                 page: number = this.currentPage, size: number = this.pageSize): void {
    const filtersToSend = { ...this.selectedFilters };

    this.auditlogService.getFilteredAuditLogs(
      filtersToSend.allFilters.join(','),
      startDate,
      endDate,
      (page - 1).toString(), // Convert to string here
      size.toString(), // Convert to string here
    ).subscribe(
      (data: Page<AuditLog>) => {
        this.pagedLogs = data.content;
        this.totalLogs = data.totalElements;
        this.auditLogs = data.content;  // store the current page of logs
      },
      (error) => {
        console.error('Error fetching audit logs', error);
      }
    );
  }


  pageChanged(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  search(): void {
    this.fetchAuditLogs(undefined, undefined, this.currentPage, this.pageSize);
  }

  toggleFilter(type: string, value: string): void {
    const index = this.selectedFilters.allFilters.indexOf(value);
    if (index === -1) {
      this.selectedFilters.allFilters.push(value);
    } else {
      this.selectedFilters.allFilters.splice(index, 1);
    }
    this.search();
  }

  clearFilters(): void {
    this.selectedFilters.allFilters = [];
    this.search();
  }

  openWindowWithoutBackdrop() {
    this.windowService.open(
      this.contentTemplate,
      {
        title: 'Permission problem',
        hasBackdrop: false,
        closeOnEsc: false,
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
}

