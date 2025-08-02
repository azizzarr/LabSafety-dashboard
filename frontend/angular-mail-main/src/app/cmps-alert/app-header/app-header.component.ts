import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs'
import {  pluck, take } from 'rxjs/operators'
import { FilterBy } from '../../models-alert/filterBy';
import { LoadEmails } from '../../store-alert/actions/email.actions';
import { State } from '../../store-alert/store';


@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  filterBy$!: Observable<FilterBy>
  @Output() menuToggle = new EventEmitter<null>()

  constructor(private store: Store<State>) {
    this.filterBy$ = this.store.select('emailState').pipe(pluck('filterBy'))
  }

  setFilter(txt: string) {

    this.filterBy$.pipe(take(1)).subscribe(filterBy=>{
      this.store.dispatch(new LoadEmails({...filterBy, txt, page:0 }))
    })
  }

  ngOnInit(): void {
  }

}
