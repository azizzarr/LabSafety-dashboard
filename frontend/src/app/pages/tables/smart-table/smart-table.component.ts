import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { AuthService } from "../../../services/auth.services";
import { User} from "../../../models/user.model";
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
@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit {
  listUsers: User[] = [];
  pagedUsers: User[] = [];
  currentPage = 1;
  pageSize = 15;
  totalUsers = 0;
  searchQuery: string = '';
  private searchTerm: string;
  private filteredUsers: any;
  userPermissions: Permission[] = [];
  private userName: string;
  adminUserCount: number;
  rhUserCount: number;
  userUserCount: number;
  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef, static: true }) disabledEscTemplate: TemplateRef<HTMLElement>;
  constructor(private authService: AuthService, private router: Router, private toastrService: NbToastrService,
  private windowService: NbWindowService) {}

  ngOnInit(): void {
   this.getAllUsers();
  this.checkReadPermission();
    if (this.listUsers.length > 0) {
      this.fetchUserPermissions(this.listUsers[0].userName);
    }
    this.fetchAdminUserCount();
    this.fetchRhUserCount();
    this.fetchUserUserCount();
  }
  getAllUsers() {
    this.authService.getAllUsers().subscribe(res => {
      this.listUsers = res as unknown as User[];
      this.sortUsersById();
      this.totalUsers = this.listUsers.length;
      this.updatePagedUsers();
    });
  }
  checkReadPermission(): void {
    const permissionName = 'READ';
    this.checkPermission(permissionName);
  }
  checkUpdatePermission(user: User): void {
    const permissionName = 'UPDATE';
    this.checkPermissionupdate(permissionName, user);
  }

  checkPermission(permissionName: string): void {
    this.authService.checkPermission(permissionName).subscribe(
      response => {
        // Log the response unconditionally (optional)
        console.log('TEST TEST:', response);
      },
      error => {
        if ( error.status === 200) {
          console.log('User has permission to read data');
          this. getAllUsers();
        } else {
          this.showToast('warning', 'ADD PERMISSION', 'you dont have the permission to add');
          console.error('Permission check error:', error);
          console.error('An error occurred while checking permission');
          this.router.navigate(['/pages/miscellaneous/404']);

        }
      }
    );
  }
  onRoleChange(event: any) {
    const roleName = event.target.value; // Get the selected role name
    if (roleName) {
      // Fetch users based on the selected role
      switch (roleName) {
        case 'RH':
          this.authService.getUsersByRoleRH().subscribe(users => {
            this.listUsers = users as unknown as User[];
            this.updatePagedUsers();
          });
          break;
        case 'ADMIN':
          this.authService.getUsersByRoleAdmin().subscribe(users => {
            this.listUsers = users as unknown as User[];
            this.updatePagedUsers();
          });
          break;
        case 'USER':
          // Handle fetching users by 'USER' role if needed
          break;
        default:
          break;
      }
    }
  }

  checkPermissionupdate(permissionName: string, user: User ): void {
    this.authService.checkPermission(permissionName).subscribe(
      response => {
        // Log the response unconditionally (optional)
        console.log('TEST TEST:', response);
      },
      error => {
        if ( error.status === 200) {
          console.log('User has permission to update data');
          localStorage.setItem('selectedUsername', user.userName);

          // Navigate to update form component and pass user data as parameter
          this.router.navigate(['pages/tables/tree-grid', { userId: user.userId }]);

        } else {
          this.showToast('warning', 'you dont have the permission to update', '');
          console.error('An error occurred while checking permission');
        }
      }
    );
  }
  sortUsersById() {
    this.listUsers.sort((a, b) => a.userId - b.userId); // Tri des utilisateurs par ID utilisateur
  }
  pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedUsers();
  }

  updatePagedUsers() {
    let filteredUsers = this.listUsers;

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      // Filter users based on search query
      const searchTerm = this.searchQuery.toLowerCase();
      filteredUsers = this.listUsers.filter(user => {
        return (
          (user.userName && user.userName.toLowerCase().includes(searchTerm)) ||
          (user.email && user.email.toLowerCase().includes(searchTerm)) ||
          (user.phone && user.phone.toLowerCase().includes(searchTerm)) ||
          (user.birthDate && user.birthDate.toString().toLowerCase().includes(searchTerm))
        );
      });
    }

    // Update pagedUsers
    this.totalUsers = filteredUsers.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalUsers);
    this.pagedUsers = filteredUsers.slice(startIndex, endIndex);

    // Set 'last' for the last user
    if (this.pagedUsers.length > 0) {
      this.pagedUsers[this.pagedUsers.length - 1].last = true;
    }

    // Reset 'last' for all other users
    for (let i = 0; i < this.pagedUsers.length - 1; i++) {
      this.pagedUsers[i].last = false;
    }

    // Fetch user permissions
    const permissionRequests = this.pagedUsers.map(user => this.fetchUserPermissions(user.userName));

    // Wait for all permission requests to complete
    forkJoin(permissionRequests).subscribe(
      (permissionsArray: Permission[][]) => {
        permissionsArray.forEach((permissions, index) => {
          // Assign permissions to the corresponding user
          this.pagedUsers[index].userPermissions = permissions;
        });
      },
      error => {
        console.error('Error fetching user permissions:', error);
      }
    );
  }












  search() {
    console.log("Search Query:", this.searchQuery); // Add this line to check searchQuery value
    if (this.listUsers.length > 0) { // Check if listUsers has data
      this.currentPage = 1;
      this.searchTerm = this.searchQuery.trim().toLowerCase(); // Update searchTerm
      this.updatePagedUsers();
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
/*
  downloadPdf(): void {
    this.authService.getPdf().subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      saveAs(response.body, filename);
    });
  }
*/
  private getFilenameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    const matches = /filename="?([^"]+)"?;?/i.exec(contentDisposition);
    return matches && matches.length > 1 ? matches[1] : 'user_list.pdf';
  }
  displayedColumns: any;
  last: Boolean;
  updateUser(user: any, userID: number): Observable<any> {
    return this.authService.updateUser(user, userID).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }
  /*
  onEditUser(user: User): void {
    // Store the username in localStorage
    localStorage.setItem('selectedUsername', user.userName);

    // Navigate to update form component and pass user data as parameter
    this.router.navigate(['pages/tables/tree-grid', { userId: user.userId }]);
  }*/
  fetchUserPermissions(userName: string): Observable<Permission[]> {
    if (!userName || userName.trim() === '') {
      console.warn('Username is null or empty. Skipping permission fetch.');
      return of([] as Permission[]); // Return an empty observable
    }

    const encodedUserName = encodeURIComponent(userName); // Encode userName

    return this.authService.getUserPermissions(encodedUserName).pipe(
      map((permissions: Permission[]) => permissions.filter(permission => permission.name !== null)),
      catchError(error => {
        console.error('Error fetching user permissions:', error);
        return of([] as Permission[]); // Return an empty observable on error
      })
    );
  }



  trackPermission(index: number, permission: Permission): any {
    return permission.id; // Or a unique property of the Permission object
  }
  getPermissionClass(permissionName: string): string {
    switch (permissionName) {
      case 'READ':
        return 'read-permission';
      case 'WRITE':
        return 'write-permission';
      case 'DELETE':
        return 'delete-permission';
      case 'UPDATE':
        return 'update-permission';
      default:
        return '';
    }
  }
  onDeleteUser(userId: number): void {
    // Call the deleteUserById method from AuthService
    this.authService.deleteUserById(userId).subscribe(
      () => {
        console.log('User deleted successfully.');
        // Remove the deleted user from pagedUsers
        this.pagedUsers = this.pagedUsers.filter(user => user.userId !== userId);
      },
      error => {
        console.error('Error deleting user:', error);
        // Handle error appropriately
      }
    );
    this.showToast('success', 'User deleted successfully', 'Permission added successfully');
  }
  fetchAdminUserCount(): void {
    this.authService.countAdminUsers().subscribe(
      count => {
        this.adminUserCount = count;
        console.log('Admin user count:', this.adminUserCount);
      },
      error => {
        console.error('Error fetching admin user count:', error);
      }
    );
  }
  fetchRhUserCount(): void {
    this.authService.countRhUsers().subscribe(
      count => {
        this.rhUserCount = count;
        console.log('rh user count:', this.rhUserCount);
      },
      error => {
        console.error('Error fetching rh user count:', error);
      }
    );
  }
  fetchUserUserCount(): void {
    this.authService.countUserUsers().subscribe(
      count => {
        this.userUserCount = count;
        console.log('user user count:', this.userUserCount);
      },
      error => {
        console.error('Error fetching rh user count:', error);
      }
    );
  }
  downloadPdf(): void {
    this.authService.getPdf().subscribe(
      (response: HttpResponse<Blob>) => {
        this.downloadFile(response.body);
        this.showToast('success', 'Pdf file uploaded successfully', '');
      },
      (error) => {
        console.error('Failed to fetch PDF: ', error);
        // Handle error as needed
      }
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
}
