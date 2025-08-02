import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Email } from '../../models-alert/email';

@Component({
  selector: 'email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent {
  @Input() email!: Email;
  @Output() toggleCheckbox = new EventEmitter<{ checked: boolean, email: Email }>();
  @Output() toggleTab = new EventEmitter<Email>();
  @Output() viewDetails = new EventEmitter<Email>();
  isChecked: any;

  onToggleCheckbox(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleCheckbox.emit({ checked: checkbox.checked, email: this.email });
  }

  onToggleTab(event: Event, tab: string): void {
    event.stopPropagation();
    this.email.tabs = this.email.tabs || [];
    const index = this.email.tabs.indexOf(tab);
    if (index === -1) {
      this.email.tabs.push(tab);
    } else {
      this.email.tabs.splice(index, 1);
    }
    this.toggleTab.emit(this.email);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.email);
    console.log('a7a',this.email);
  }
}
