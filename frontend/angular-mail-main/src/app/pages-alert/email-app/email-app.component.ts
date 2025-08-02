import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';

import { State } from '../../store-alert/store';

import { Email } from '../../models-alert/email';
// import { Email } from '../../models-alert/email';
import { RemoveEmail, LoadEmail, SaveLabel, RemoveLabel, REMOVED_LABEL, LoadLabels } from '../../store-alert/actions/email.actions';
import { FilterBy } from '../../models-alert/filterBy';
import { ActivatedRoute, Router } from '@angular/router';
import { Label } from '../../models-alert/label';
import { Actions, ofType } from '@ngrx/effects';
// import {FirebaseService} from "../../../../../src/app/services/firebase.service";



@Component({
  selector: 'email-app',
  templateUrl: './email-app.component.html',
  styleUrls: ['./email-app.component.scss'],
})
export class EmailAppComponent implements OnInit {

  labels$: Observable<Label[]>
  isLoading$: Observable<boolean>
  error$: Observable<string>
  isCompose = false
  isFullMenu = window.innerWidth > 900


  constructor(private store: Store<State>,
  //  private firebaseService : FirebaseService,
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,) {
    this.labels$ = this.store.select('emailState').pipe(pluck('labels'));
    this.isLoading$ = this.store.select('emailState').pipe(pluck('isLoading'));
    this.error$ = this.store.select('emailState').pipe(pluck('error'));

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.isCompose = !!params['compose']
      }
    )
  }

  openCompose() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { compose: 'new' },
      })
  }
  removeEmail(emailId: string) {
    this.store.dispatch(new RemoveEmail(emailId));
  }
  editEmail(emailId: string) {
    this.store.dispatch(new LoadEmail(emailId));
  }
  saveLabel(label: Label) {
    this.store.dispatch(new SaveLabel(label))
  }
  removeLabel(labelId: string) {
    this.store.dispatch(new RemoveLabel(labelId))
  }
}
