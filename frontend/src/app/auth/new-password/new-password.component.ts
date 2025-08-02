import { Component, OnInit } from '@angular/core';
// import { OwlOptions } from 'ngx-owl-carousel-o';
// import { DataService } from 'src/app/shared/service/data/data.service';
import { passwordResponce, register } from 'app/models/register.model';
// import { routes } from 'src/app/shared/service/routes/routes';
import {AuthService} from "../../services/auth.services";
import {Router} from "@angular/router";
@Component({
  selector: 'ngx-app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  user = {
    username: '',
    email: '',
    password: '',
    role: '',
  };
 // public routes = routes;
  password= 'password';
  show1 = true;

  confirmPassword= 'password';
  show2 = true;
  show: any;
  redirectDelay = 0;
  showMessages = {
    success: undefined,
    error: undefined,
  };
  strategy = '';
  errors = [];
  messages = [];
  // user = {};
  submitted = false;
  socialLinks = [];
  rememberMe = false;

  public registerForm:register={}
  public passwordResponce:passwordResponce={};
  public confirmPasswordResponce:passwordResponce={};
  public newPassword: any = [];
/*
  public newPasswordOwlOptions: OwlOptions = {
    margin: 25,
    nav: true,
    loop: true,
    responsive: {
        0: {
          items: 1
        },
        768 : {
          items: 3
        },
        1170: {
          items: 4
        }
    },
  };
*/
  constructor(
    private authService: AuthService,
   // private dataService: DataService,
   // public router: Router,
  ) {}

  ngOnInit(): void {
  }
  onClick(type:string) {
    if (type === 'password') {
      if (this.password === 'password') {
        this.password = 'text';
        this.show1 = false;
      } else {
        this.password = 'password';
        this.show1 = true;
      }
    }else {
      if (this.confirmPassword === 'password') {
        this.confirmPassword = 'text';
        this.show2 = false;
      } else {
        this.confirmPassword = 'password';
        this.show2 = true;
      }
    }

  }
  public onChangePassword(password:any,type:string){
    if (type === 'Password') {
      if(password.match(/^$|\s+/)) {
        this.passwordResponce.passwordResponceText = "whitespaces are not allowed"
        this.passwordResponce.passwordResponceImage = ""
        this.passwordResponce.passwordResponceKey = ''
        return
      }
      if(password.length == 0){
        this.passwordResponce.passwordResponceText = ""
        this.passwordResponce.passwordResponceImage = ""
        this.passwordResponce.passwordResponceKey = ''
        return
      }
      if (password.length < 8) {
        this.passwordResponce.passwordResponceText = "Weak. Must contain at least 8 characters"
        this.passwordResponce.passwordResponceImage = "assets/img/icon/angry.svg"
        this.passwordResponce.passwordResponceKey = '0'
      } else if (password.search(/[a-z]/) < 0) {
        this.passwordResponce.passwordResponceText = "Average. Must contain at least 1 upper case and number"
        this.passwordResponce.passwordResponceImage = "assets/img/icon/anguish.svg"
        this.passwordResponce.passwordResponceKey = '1'
      } else if(password.search(/[A-Z]/) < 0) {
        this.passwordResponce.passwordResponceText = "Average. Must contain at least 1 upper case and number"
        this.passwordResponce.passwordResponceImage = "assets/img/icon/anguish.svg"
        this.passwordResponce.passwordResponceKey = '1'
      } else  if (password.search(/[0-9]/) < 0) {
        this.passwordResponce.passwordResponceText= "Average. Must contain at least 1 upper case and number"
        this.passwordResponce.passwordResponceImage = "assets/img/icon/anguish.svg"
        this.passwordResponce.passwordResponceKey = '1'
      } else  if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
        this.passwordResponce.passwordResponceText = "Almost. Must contain special symbol"
        this.passwordResponce.passwordResponceImage = "assets/img/icon/smile.svg"
        this.passwordResponce.passwordResponceKey = '2'
      }
      else {
        this.passwordResponce.passwordResponceText = "Awesome! You have a secure password."
          this.passwordResponce.passwordResponceImage = "assets/img/icon/smile.svg"
           this.passwordResponce.passwordResponceKey = '3'
       }
    }else {
      if(password.match(/^$|\s+/)) {
        this.confirmPasswordResponce.passwordResponceText = "whitespaces are not allowed"
        this.confirmPasswordResponce.passwordResponceImage = ""
        this.confirmPasswordResponce.passwordResponceKey = ''
        return
      }
      if(password.length == 0){
        this.confirmPasswordResponce.passwordResponceText = ""
        this.confirmPasswordResponce.passwordResponceImage = ""
        this.confirmPasswordResponce.passwordResponceKey = ''
        return
      }
      if (password.length < 8) {
        this.confirmPasswordResponce.passwordResponceText = "Weak. Must contain at least 8 characters"
        this.confirmPasswordResponce.passwordResponceImage = "assets/img/icon/angry.svg"
        this.confirmPasswordResponce.passwordResponceKey = '0'
      } else if (password.search(/[a-z]/) < 0) {
        this.confirmPasswordResponce.passwordResponceText = "Average. Must contain at least 1 upper case and number"
        this.confirmPasswordResponce.passwordResponceImage = "assets/img/icon/anguish.svg"
        this.confirmPasswordResponce.passwordResponceKey = '1'
      } else if(password.search(/[A-Z]/) < 0) {
        this.confirmPasswordResponce.passwordResponceText = "Average. Must contain at least 1 upper case and number"
        this.confirmPasswordResponce.passwordResponceImage = "assets/img/icon/anguish.svg"
        this.confirmPasswordResponce.passwordResponceKey = '1'
      } else  if (password.search(/[0-9]/) < 0) {
        this.confirmPasswordResponce.passwordResponceText= "Average. Must contain at least 1 upper case and number"
        this.confirmPasswordResponce.passwordResponceImage = "assets/img/icon/anguish.svg"
        this.confirmPasswordResponce.passwordResponceKey = '1'
      } else  if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
        this.confirmPasswordResponce.passwordResponceText = "Almost. Must contain special symbol"
        this.confirmPasswordResponce.passwordResponceImage = "assets/img/icon/smile.svg"
        this.confirmPasswordResponce.passwordResponceKey = '2'
      }
      else {
        this.confirmPasswordResponce.passwordResponceText = "Awesome! You have a secure password."
          this.confirmPasswordResponce.passwordResponceImage = "assets/img/icon/smile.svg"
           this.confirmPasswordResponce.passwordResponceKey = '3'
       }
    }

  }
  updatePassword(newPassword: string): void {
    this.authService.updatePasswordByEmail(newPassword).subscribe(
      response => {
        console.log('Password updated successfully:', response);
        // Handle success as needed
      },
      error => {
        console.error('Error updating password:', error);
        // Handle error as needed
      }
    );
  }

  getConfigValue(required: string) {
    return undefined;
  }
}
