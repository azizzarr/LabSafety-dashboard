import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import {
  NbCalendarRange,
  NbDateService,
  NbSortDirection, NbSortRequest,
  NbStepperComponent,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder
} from '@nebular/theme';
import { DayCellComponent } from '../../extra-components/calendar/day-cell/day-cell.component';
import { User } from '../../../models/user.model';
import {ERole, Role} from '../../../models/role.model';
import {AuthService} from '../../../services/auth.services';
import {SignUpRequest} from "../../../models/signup-request.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Permission, PermissionName} from "../../../models/permission.model";

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

@Component({
  selector: 'ngx-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.scss'],
})
export class TreeGridComponent implements OnInit{
  @ViewChild('stepper') stepper: NbStepperComponent;
  firstForm: FormGroup;
  secondForm: UntypedFormGroup;
  thirdForm: UntypedFormGroup;
  userId: number;
  date = new Date();
  userPermissions: Permission[] = [];
  user = {
    userName: '',
    email: '',
    password: '',
    phone: '',
    birthDate: new Date(),
    // role: '', // No need for role here
  };
  public roles: Role[] = [];
  public selectedRole: Role;
  // public roles: { name: any; selected: boolean }[] = [];
  // stepper: any;
//  date2 = new Date();
  range: NbCalendarRange<Date>;
  dayCellComponent = DayCellComponent;
  permissions = [
    {
      category: 'Management', permissions: [
        { name: PermissionName.DELETE, value: false },
        { name: PermissionName.READ, value: false },
        { name: PermissionName.WRITE, value: false},
      ],
    },

    {
      category: 'Data', permissions: [
        { name: PermissionName.IMPORT, value: false },
        { name: PermissionName.UPDATE, value: false },
      ],
    },
  ];

  addPermission: any;
  constructor(protected dateService: NbDateService<Date>, private fb: FormBuilder,
              private authService: AuthService, private route: ActivatedRoute, private router: Router ) {
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
  }
/*
  togglePermission(permission: any) {
    permission.value = !permission.value;
  }
*/
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId']; // Extract user ID from route parameters
      // Fetch user information using the user ID
      this.authService.getUserById(this.userId).subscribe(
        (user: any) => {
          this.user = user; // Store user information
          // Prefill form fields with user information
          this.firstForm.patchValue({
            userName: this.user.userName,
            email: this.user.email,
            password: this.user.password,
            phone: this.user.phone,
            // Update other form fields as needed
          });
        },
        error => {
          console.error('Error fetching user:', error);
          // Handle error, if needed
        }
      );
    });

    // Initialize form controls and validators
    this.firstForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      // Add more form controls as needed
    });

    // Fetch roles from the backend
    this.authService.getRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
      },
      error => {
        console.log(error);
        // Handle error, if needed
      }
    );
    const userName = localStorage.getItem('selectedUsername');
    if (userName) {
      this.authService.getUserPermissions(userName).subscribe(
        permissions => {
          this.userPermissions = permissions;
          console.log('Permissions fetched for user:', userName, this.userPermissions); // Log fetched permissions

          // Store permissions in local storage
          localStorage.setItem('userPermissions', JSON.stringify(this.userPermissions));
          console.log('Permissions stored in local storage.');

          // Call initializeToggleSwitches after fetching and storing permissions
          this.initializeToggleSwitches();
        },
        error => {
          console.error('Error fetching user permissions:', error);
          // Handle error as needed
        }
      );
    }
  }
  fetchUserPermissions(userName: string): void {
    console.log('fetchUserPermissions called with userName:', userName);
    if (!userName || userName.trim() === '') {
      console.warn('Username is null or empty. Skipping permission fetch.');
      console.log('Fetching permissions for user:', userName);
      return;
    }

    const encodedUserName = encodeURIComponent(userName);

    this.authService.getUserPermissions(encodedUserName)
      .subscribe(
        permissions => {
          this.userPermissions = permissions;
        //  console.log('Permissions fetched for user:', userName, this.userPermissions); // Log fetched permissions

          // Store permissions in local storage
          localStorage.setItem('userPermissions', JSON.stringify(this.userPermissions));
          console.log('Permissions stored in local storage.');

        },
        error => {
          console.error('Error fetching user permissions:', error);
          // Handle error as needed
        }
      );
  }




  initializeToggleSwitches() {
    // Retrieve permissions from local storage
    const permissions = JSON.parse(localStorage.getItem('userPermissions'));
    if (!permissions) {
      console.warn('Permissions not found in local storage.');
      return;
    }

    console.log('Permissions fetched from local storage:', permissions); // Log fetched permissions

    // Clear the data inside the userPermissions item in local storage
   // localStorage.removeItem('userPermissions');

    console.log('Initializing toggle switches...');

    // Loop through permissions and initialize toggle switches
    this.permissions.forEach(category => {
      category.permissions.forEach(permission => {
        // Assume all permissions are initially turned off
        permission.value = false;

        // Find the corresponding permission in fetched permissions
        const userPermission = permissions.find(p => p.permissionName.trim() === permission.name.trim());
        if (userPermission) {
          // If the permission is found, update its value
          permission.value = true;
          console.log('Permission:', permission.name, 'Value:', permission.value);

          // Log the data binding
          console.log('Data Binding - permission.value:', permission.value ? 'checked' : 'not checked');
        } else {
          console.log('Permission not found:', permission.name);
        }
      });
    });

    console.log('Toggle switches initialized.');
  }

















  togglePermission(permission: any) {
    // Call the backend API to update the permission
    this.authService.addPermissionToUser(localStorage.getItem('selectedUsername'), permission.name).subscribe(
      () => {
        // Toggle switch value in UI
        permission.value = !permission.value;
      },
      (error) => {
        console.error('Error adding permission to user:', error);
      }
    );
  }
  onFirstSubmit() {
    const selectedRoles = this.roles.filter(role => role.selected).map(role => role.name);

    if (selectedRoles.length === 0) {
      console.error("No role selected");
      return;
    }

    const selectedRoleName = selectedRoles[0]; // Assuming only one role is selected

    localStorage.setItem('selectedRole', selectedRoleName); // Store the selected role name in local storage
    localStorage.setItem('username', this.firstForm.get('username').value); // Store the username in local storage
    const username = localStorage.getItem('username');

    if (!username) {
      console.error("Username not found in localStorage");
      return;
    }
    const signUpRequest: SignUpRequest = {
      username: this.firstForm.get('userName').value,
      email: this.firstForm.get('email').value, // Retrieve email from the form
      password: this.firstForm.get('password').value, // Retrieve password from the form
      phone: this.firstForm.get('phone').value, // R
      birthDate: this.user.birthDate,
      roles: selectedRoles,
    };

    this.authService.signup(signUpRequest).subscribe(
      response => {
        console.log(response);
        // You may remove this line if you don't want to remove the role name from local storage after signup
        // localStorage.removeItem('selectedRole');
        // Move to the next step in the stepper after successful signup
        localStorage.setItem('userId', response.userId);
      },
      error => {
        console.log(error);
      }
    );
    this.stepper.next();
  }
  updateUser(user: any, userID: number): Observable<any> {
    return this.authService.updateUser(user, userID).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }
  onSubmit(): void {
    if (this.firstForm.valid) {
      // Get updated user data from the form
      const updatedUserData = this.firstForm.value;
      // Call the updateUser method with updated data and user ID
      this.updateUser(updatedUserData, this.userId).subscribe(
        response => {
          console.log('User updated successfully:', response);
          this.router.navigate(['pages/tables/smart-table']);
          // Handle success, e.g., display success message or navigate to another page
        },
        error => {
          console.error('Error updating user:', error);
          // Handle error, if needed
        }
      );
    }
  }




  onSecondSubmit() {
    // Check if the "ADD" permission is toggled on
    const addPermission = this.permissions[0].permissions.find(permission => permission.name === 'WRITE');

    // Store the addPermission value in localStorage
    localStorage.setItem('addPermission', JSON.stringify(addPermission));

    if (addPermission && addPermission.value) {
      const username = localStorage.getItem('selectedUsername'); // Use 'username' instead of 'userName'
      if (!username) {
        console.error('Username not found in localStorage');
        return;
      }
      this.authService.addPermissionToUser(username, 'WRITE').subscribe(
        response => {
          console.log('Permission added successfully:', response);
          // Move to the third step in the stepper
          // this.stepper.next();
        },
        error => {
          console.error('Error adding permission:', error);
          // Handle error, if needed
        }
      );
    }
    this.stepper.next();
  }



  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
  }

  onDateSelect(date: Date) {
    this.user.birthDate = date; // Update the birthdate property with the selected date
  }

  toggleRole(roleIndex: number) {
    this.roles.forEach((role, index) => {
      if (index === roleIndex) {
        role.selected = true;
      } else {
        role.selected = false;
      }
    });
  }

  addUser(data: any) {
    this.authService.addUser(data).subscribe(
      (response) => {
        console.log('User added successfully:', response);
        // Handle success, if needed
      },
      (error) => {
        console.error('Error adding user:', error);
        // Handle error, if needed
      }
    );
  }
redirectToTable() {
  this.router.navigate(['pages/tables/smart-table']);
}
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
