import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.services";
import { Router } from "@angular/router";
import { SignUpRequest } from 'app/models/signup-request.model';
import { Role } from "../../../models/role.model";

class PasswordResponse {
}

class Register {
}

@Component({
  selector: 'ngx-app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user = {
    username: '',
    email: '',
    password: '',
    phone: '',
    birthDate: new Date(),
    // role: '', // No need for role here
  };
  public roles: Role[] = [];
  public selectedRole: Role; // Updated to hold the selected role
  // public routes = routes;
  public registerForm: Register = {};
  public passwordResponse: PasswordResponse = {};
  public register: any = [];

  show = true;
  redirectDelay = 0;
  showMessages = {
    success: undefined,
    error: undefined,
  };
  strategy = '';
  errors = [];
  messages = [];
  submitted = false;
  socialLinks = [];
  rememberMe = false;

  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
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

  onClick() {
    // Password toggle logic
  }

  public onChangePassword(password: any) {
    // Password validation logic
  }

  onSubmit(): void {
    const selectedRoleName = this.selectedRole ? this.selectedRole.name : null;

    if (!selectedRoleName) {
      console.error("No role selected");
      return;
    }

    localStorage.setItem('selectedRole', selectedRoleName);

    const signUpRequest: SignUpRequest = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      phone: this.user.phone,
      birthDate: this.user.birthDate,
      roles: [selectedRoleName], // Assign selected role name as an array
    };

    this.authService.signup(signUpRequest).subscribe(
      response => {
        console.log(response);
        localStorage.removeItem('selectedRole'); // Remove role name from local storage
      },
      error => {
        console.log(error);
      }
    );
    this.router.navigate(['/auth/ngx-app-login']);
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

  addRole(): void {
    // Add a new role to the roles array
  }
}
