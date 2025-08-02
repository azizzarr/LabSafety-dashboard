import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
})
export class DialogNamePromptComponent {
  @Input() title: string;
  @Input() averageChargeEsd: number;
  @Input() under40Percentage: number;
  @Input() between40And80Percentage: number;
  @Input() over80Percentage: number;

  constructor(protected ref: NbDialogRef<DialogNamePromptComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

  dismiss() {
    this.ref.close();
  }
}
