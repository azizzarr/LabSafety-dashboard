import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Email } from '../../models-alert/email';
import { State } from '../../store-alert/store';
import { UpdateEmails } from '../../store-alert/actions/email.actions';
import { AlertService} from "../../services-alert/Alert.service";
import { Alert } from '../../models-alert/alert';
import { Router } from '@angular/router';

@Component({
  selector: 'email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit, OnDestroy {
  emails$: Observable<Email[]>;
  isLoading$: Observable<boolean>;
  selectedEmails: Email[] = [];
  alertSubscription: Subscription | null = null;

  constructor(
    private store: Store<State>,
    private alertService: AlertService,
    private router: Router // Add Router to constructor
  ) {
    this.emails$ = this.store.select('emailState').pipe(pluck('emails'));
    this.isLoading$ = this.store.select('emailState').pipe(pluck('isLoading'));
  }

  ngOnInit(): void {
    console.log('Fetching alerts...'); // Log when fetching alerts starts

    this.alertSubscription = this.alertService.getAllAlerts().subscribe({
      next: (alerts: { [key: string]: Alert }) => {
        console.log('Fetched alerts:', alerts); // Log fetched alerts

        const alertEmails: Email[] = Object.keys(alerts).map(key => ({
          _id: key,
          name: alerts[key].Matricule,
          subject: alerts[key].title,
          body: alerts[key].message,
          status: alerts[key].status,
          savedAt: new Date(alerts[key].timestamp).getTime(),
          isRead: false,
          tabs: [], // Adjust based on your logic
          to: ''
        }));

        console.log('Transformed alert emails:', alertEmails); // Log transformed alert emails

        // Dispatch action to update emails in the store
        this.store.dispatch(new UpdateEmails(alertEmails));
      },
      error: err => {
        console.error('Failed to load alerts', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

  toggleCheckbox(payload: { checked: boolean, email: Email }): void {
    if (payload.checked) {
      this.selectedEmails.push(payload.email);
    } else {
      const idx = this.selectedEmails.findIndex(e => e._id === payload.email._id);
      this.selectedEmails.splice(idx, 1);
    }
  }

  toggleTab(updated: Email): void {
    this.store.dispatch(new UpdateEmails([updated]));
    // Optionally, you can dispatch an action here to reload emails after updating
  }

  onRemoveEmails(): void {
    // Implement your logic to remove selected emails
  }

  setPage(diff: number): void {
    // Implement your logic to handle pagination
  }

  onSetReadStat(): void {
    // Implement your logic to mark emails as read/unread
  }

  loadByLabel(): void {
    // Implement your logic to load emails by label (if needed)
  }

  viewEmailDetails(email: Email): void {
    const tab = this.router.url.split('/').pop() || 'Alerts'; // Get the current tab from the URL
    this.router.navigate(['/email', tab, email._id]);
  }

}
