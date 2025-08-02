import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../models-alert/alert';

@Component({
  selector: 'email-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.scss']
})
export class EmailDetailsComponent implements OnInit {
  email: Alert | undefined; // Ensure Alert type matches your model

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log('Resolved data:', data); // Verify resolved data
      this.email = data['email'].value; // Adjusting to the correct structure

      console.log('Resolved email:', this.email);
    });
  }
  redirectToFlaskApp() {
    window.location.href = 'http://127.0.0.1:8070/';
  }
}
