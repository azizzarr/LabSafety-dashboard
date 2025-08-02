/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {
  NbAlertModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule, NbIconModule, NbInputModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register-page/register/register.component';
import {VerificationCodeComponent} from './auth/verification-code/verification-code.component';
import {NewPasswordComponent} from './auth/new-password/new-password.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import {ModalOverlaysModule} from "./pages/modal-overlays/modal-overlays.module";
import {AuthService} from "./services/auth.services";
import {AlertTableComponent} from "./pages/tables/alert-table/alert-table.component";
import {HistoriqueTableComponent} from "./pages/tables/historique-table/historique-table.component";
// import {AppAlertModule} from "../../angular-mail-main/src/app/app-alert.module";
 // import {FirebaseService} from "./services/firebase.service";

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, VerificationCodeComponent,
    NewPasswordComponent, AlertTableComponent, HistoriqueTableComponent],
  imports: [
   // AppAlertModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ModalOverlaysModule,
    MatPaginatorModule,
    MatSliderModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbIconModule,
    NbAlertModule,
    NbInputModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
