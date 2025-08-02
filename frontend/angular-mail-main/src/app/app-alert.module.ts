import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppAlertRoutingModule } from './app-alert-routing.module';

import { reducers, metaReducers } from './store-alert/store';
import { AppEffects } from './store-alert/app.effects';

import { AppComponent } from './app-root-alert/index';
import { HomeComponent } from './pages-alert/home/home.component';
import { EmailAppComponent } from './pages-alert/email-app/email-app.component';

import { AppHeaderComponent } from './cmps-alert/app-header/app-header.component';


import { EmailDetailsComponent } from './pages-alert/email-details/email-details.component';
import { EmailPreviewComponent } from './cmps-alert/email-preview/email-preview.component';
import { EmailFilterComponent } from './cmps-alert/email-filter/email-filter.component';
import { FolderListComponent } from './cmps-alert/folder-list/folder-list.component';
import { EmailListComponent } from './pages-alert/email-list/email-list.component';
import { EmailComposeComponent } from './cmps-alert/email-compose/email-compose.component';
import { SearchInputComponent } from './cmps-alert/search-input/search-input.component';
import { HeaderSvgComponent } from './svg-cmps-alert/header-svg/header-svg.component';
import { FolderListSvgComponent } from './svg-cmps-alert/folder-list-svg/folder-list-svg.component';
import { CapitalizePipe } from './pipes-alert/capitalize.pipe';
import { LabelEditComponent } from './cmps-alert/label-edit/label-edit.component';
import { FirstWordPipe } from './pipes-alert/first-word.pipe';

import { LabelSelectorComponent } from './cmps-alert/label-selector/label-selector.component';
import { LabelTagComponent } from './cmps-alert/label-tag/label-tag.component';
import { DateFormatPipe } from './pipes-alert/date-format.pipe';
import { DateOrAgoPipe } from './pipes-alert/date-or-ago.pipe';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AuthInterceptor} from "./auth.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AppHeaderComponent,
        EmailAppComponent,
        EmailDetailsComponent,
        EmailPreviewComponent,
        EmailFilterComponent,
        FolderListComponent,
        EmailListComponent,
        EmailComposeComponent,
        SearchInputComponent,
        HeaderSvgComponent,
        FolderListSvgComponent,
        CapitalizePipe,
        FirstWordPipe,
        LabelEditComponent,
        LabelSelectorComponent,
        LabelTagComponent,
        DateFormatPipe,
        DateOrAgoPipe,
    ],
    imports: [
      RouterModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppAlertRoutingModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
            },
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        EffectsModule.forRoot([AppEffects]),
        CommonModule,
    ],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
    ],
    bootstrap: [AppComponent],
    exports: [
        AppComponent,
        HomeComponent,
        DateOrAgoPipe
    ]
})
export class AppAlertModule {}
