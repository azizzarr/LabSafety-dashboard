import { Component, OnInit } from '@angular/core';
// import { DataService } from 'app/shared/service/data/data.service';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'ngx-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  passwordType: string = 'password';
  showPassword: boolean = true;
  formGroup: FormGroup;
  public welcomeLogin: any = [];
  show: any;
  redirectDelay = 0;
  showMessages = {
    success: undefined,
    error: undefined,
  };
  strategy = '';
  errors = [];
  messages = [];
  user = {};
  submitted = false;
  socialLinks = [];
  rememberMe = false;


  constructor(
    private authService: AuthService,
  //  private dataService: DataService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }

  directIndex() {
    this.router.navigate(['/instructor/instructor-dashboard']);
  }

  public loginProcess(): void {
    console.log('loginProcess() called');
    if (this.formGroup.valid) {
      console.log('formGroup is valid');
      this.authService.signin(this.formGroup.value).subscribe((formGroup) => {
        // console.log('signin result:', result);
        if (this.formGroup.valid) { // Assuming result contains necessary data for success
        //  console.log(result);
          this.router.navigate(['/pages/dashboard']);
          this.authService.storeToken(formGroup.token);
         // this.authService.storeUserId(formGroup.userId);
          // this.router.navigate(['/home']);
        } else {
          alert('An error occurred. Please try again.'); // Generic error message
        }
      }, (error) => {
        console.error('Error signing in:', error);
        alert('An error occurred while signing in. Please try again later.');
      });
    } else {
      console.log('formGroup is invalid');
    }
  }

}
