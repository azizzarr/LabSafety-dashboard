import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { OwlOptions } from 'ngx-owl-carousel-o';
// import { DataService } from 'src/app/shared/service/data/data.service';
 // mport { routes } from 'src/app/shared/service/routes/routes';
import {AuthService} from "../../services/auth.services";

@Component({
  selector: 'ngx-app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit {
  public verificationCode: any = [];
  // public routes = routes;
  user = {
    username: '',
    email: '',
    password: '',
    role: '',
  };
  public oneTimePassword = {
    data1: "",
    data2: "",
    data3: "",
    data4: ""
  };
  show: any;
  redirectDelay = 0;
  showMessages = {
    success: undefined,
    error: undefined,
  };
  strategy = '';
  errors = [];
  messages = [];
 //  user = {};
  submitted = false;
  socialLinks = [];
  rememberMe = false;

  /*
  public verificationCodeOwlOptions: OwlOptions = {
    margin: 24,
    nav: true,
    loop: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1170: {
        items: 1,
      },
    },
  };
*/
  public ValueChanged(data: string, box: string): void {
    if (box == 'digit-1' && data.length > 0) {
      document.getElementById('digit-2')?.focus();
    } else if (box == 'digit-2' && data.length > 0) {
      document.getElementById('digit-3')?.focus();
    } else if (box == 'digit-3' && data.length > 0) {
      document.getElementById('digit-4')?.focus();
    } else {
      return
    }
  }
  public tiggerBackspace(data: any, box: string) {
    let StringyfyData: any;
    if (data) {
      StringyfyData = data.toString();
    } else {
      StringyfyData = null;
    }
    if (box == 'digit-4' && StringyfyData == null) {
      document.getElementById('digit-3')?.focus();
    } else if (box == 'digit-3' && StringyfyData == null) {
      document.getElementById('digit-2')?.focus();
    } else if (box == 'digit-2' && StringyfyData == null) {
      document.getElementById('digit-1')?.focus();
    }
  }


  constructor( private authService: AuthService) {
  }

  ngOnInit(): void {
  }
  sendPasswordResetEmail(email: string): void {
    this.authService.sendPasswordResetEmail(email).subscribe(
      response => {
        console.log('Password reset email sent successfully:', response);
        // Handle success as needed
      },
      error => {
        console.error('Error sending password reset email:', error);
        // Handle error as needed
      },
    );
    localStorage.setItem('resetEmail', email);
  }

}
