import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription  } from 'rxjs'
import {  pluck, take, tap } from 'rxjs/operators'
import { FilterBy } from '../models-alert/filterBy';
import { LoadEmails, LoadLabels } from '../store-alert/actions/email.actions';
import { State } from '../store-alert/store';
import { of, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  template: `
  <section class="app-root">
    <router-outlet></router-outlet>
  </section>
 `,
})
export class AppComponent {

  title = 'Angular Email'

  constructor(private store: Store<State>) {
  }

  ngOnInit() {
    this.store.dispatch(new LoadLabels());
    this.retrieveTokenFromUrl();
  }

  private retrieveTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('auth_token', token); // Store the token in local storage
      console.log('Token received:', token); // Log the received token
    } else {
      console.warn('No token found in the URL.');
    }
  }




}
