import { Component } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { RedirectionService } from '../services/Redirection.service'; // Adjust the import path
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu = MENU_ITEMS;

  constructor(private redirectionService: RedirectionService, private menuService: NbMenuService) {
    this.menuService.onItemClick()
      .pipe(filter(({ item }) => item.title === 'Alerts'))
      .subscribe(() => this.redirectionService.redirectToDash1());
  }
}
