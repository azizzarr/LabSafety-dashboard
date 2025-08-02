import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import {
  NbCalendarRange, NbComponentStatus,
  NbDateService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbStepperComponent,
  NbToastrConfig,
  NbToastrService, NbWindowService
} from '@nebular/theme';
import { DayCellComponent } from '../../extra-components/calendar/day-cell/day-cell.component';
import { User } from '../../../models/user.model';
import {ERole, Role} from '../../../models/role.model';
import {AuthService} from '../../../services/auth.services';
import {SignUpRequest} from '../../../models/signup-request.model';
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {PermissionName} from "../../../models/permission.model";




@Component({
  selector: 'ngx-stepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef, static: true }) disabledEscTemplate: TemplateRef<HTMLElement>;
  @ViewChild('stepper') stepper: NbStepperComponent;
  firstForm: FormGroup;
  secondForm: UntypedFormGroup;
  thirdForm: UntypedFormGroup;
  date = new Date();
  user = {
    username: '',
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
  date2 = new Date();
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
  constructor(
    protected dateService: NbDateService<Date>,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private windowService: NbWindowService,

  ) {
    // Remove this line, as you don't need to manually create ToastrComponent
    // this.toastrComponent = new ToastrComponent();
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
  }


  togglePermission(permission: any) {
    permission.value = !permission.value;
  }
  /*
  checkPermission(permissionName: string): void {
    this.authService.checkPermission(permissionName).subscribe(
      response => {
        console.log('Permission check response:', response);
        // Handle success
      },
      error => {
        console.error('Permission check error:', error);
        // Handle error
      }
    );
  }
  checkWritePermission(): void {
    const permissionName = 'WRITE';
    this.checkPermission(permissionName);
  }
*/
  ngOnInit() {
    this.secondForm = this.fb.group({});
    /*
    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });
*/
    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });

    this.firstForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, Validators.required],
      phone: [this.user.phone, Validators.required],
      birthDate: [this.user.birthDate, Validators.required],
    });
    /*
        this.roles = Object.keys(ERole)
          .filter(key => isNaN(Number(ERole[key]))) // Filter out enum numeric values
          .map(key => ({ name: ERole[key], selected: false }));
          */
    this.authService.getRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
      },
      error => {
        console.log(error);
        // Handle error, if needed
      }
    );
  }
  test()
  {
    const permissionName = 'WRITE';
    const token = localStorage.getItem('auth_token');
    this.authService.checkPermission1(permissionName, token);
  }
  onFirstSubmit() {
    this.checkWritePermission();
  }

  checkWritePermission(): void {
    const permissionName = 'WRITE';
    this.checkPermission(permissionName);
  }

  checkPermission(permissionName: string): void {
    this.authService.checkPermission(permissionName).subscribe(
      response => {
        // Log the response unconditionally (optional)
        console.log('TEST TEST:', response);
      },
      error => {
        if ( error.status === 200) {
          console.log('User has permission to WRITE');
          this.signup();
        } else {
          this.showToast('warning', 'ADD PERMISSION', 'you dont have the permission to add');
          console.error('Permission check error:', error);
          console.error('An error occurred while checking permission');
          this.openWindowWithoutBackdrop();
        }
      }
    );
  }










  signup(): void {
    // Your registration logic goes here
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
    const birthDateString = localStorage.getItem('birthdate');
    if (!birthDateString) {
      console.error("Birthdate not found in localStorage");
      return;
    }

    // Parse the ISO string to a Date object
    const birthDate = new Date(birthDateString);

    // Format the date to "YYYY-MM-DD" format
    const formattedBirthDate = birthDate.toISOString().split('T')[0];
   // const formattedBirthDate = localStorage.getItem('birthdateL');
    const signUpRequest: SignUpRequest = {
      username: this.firstForm.get('username').value,
      email: this.firstForm.get('email').value, // Retrieve email from the form
      password: this.firstForm.get('password').value, // Retrieve password from the form
      phone: this.firstForm.get('phone').value, // Retrieve phone from the form
      birthDate: formattedBirthDate,
      roles: selectedRoles,
    };

    this.authService.signup(signUpRequest).subscribe(
      response => {
        console.log(response);
        // You may remove this line if you don't want to remove the role name from local storage after signup
        // localStorage.removeItem('selectedRole');
        // Move to the next step in the stepper after successful signup
        localStorage.setItem('userId', response.userId);
        this.showToast('success', 'Success', 'User added successfully');
        this.stepper.next();
        setTimeout(() => {
          this.exportUsers(); // Call exportUsers method after a delay
        }, 1000);
      },
      error => {
        console.log(error);
      }
    );
  }


  onSecondSubmit() {
    const username = localStorage.getItem('username'); // Use 'username' instead of 'userName'
    if (!username) {
      console.error('Username not found in localStorage');
      return;
    }

    // Iterate through each permission
    for (const permissionCategory of this.permissions) {
      for (const permission of permissionCategory.permissions) {
        if (permission.value) { // Check if the permission is toggled on
          // Call the backend API to add the permission to the user
          this.authService.addPermissionToUser(username, permission.name).subscribe(
            response => {
              console.log(`Permission ${permission.name} added successfully:`, response);
            },
            error => {
              console.error(`Error adding permission ${permission.name}:`, error);
              // Handle error, if needed
            }
          );
        }
      }
    }

    // Proceed to the next step in the stepper
    this.stepper.next();
    this.showToast('success', 'Success', 'Permissions added successfully');
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
  onDateSelect(date: Date): void {
    this.user.birthDate = date; // Assign selected date directly to user's birthdate property
    localStorage.setItem('birthdate', date.toISOString()); // Store the selected date in local storage
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
  exportUsers(): void {
    this.authService.exportUsers().subscribe(
      response => {
        console.log('Users exported successfully:', response);
        // Handle success
      },
      error => {
        console.error('Failed to export users:', error);
        // Handle error
      }
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

  title = 'HI there!';
  content = `I'm cool toaster!`;

  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  quotes = [
    { title: null, body: 'We rock at Angular' },
    { title: null, body: 'Titles are not always needed' },
    { title: null, body: 'Toastr rock!' },
  ];

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }

  openRandomToast () {
    const typeIndex = Math.floor(Math.random() * this.types.length);
    const quoteIndex = Math.floor(Math.random() * this.quotes.length);
    const type = this.types[typeIndex];
    const quote = this.quotes[quoteIndex];

    this.showToast(type, quote.title, quote.body);
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `. ${title}` : '';

    this.index += 1;
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
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
}
