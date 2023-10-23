import { Component, Inject, Input } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-message-alert',
  templateUrl: './message.alert.component.html',
  styleUrls: ['./message.alert.component.css'],
})
export class MessageAlertComponent {
  constructor(
    private snackBarRef: MatSnackBarRef<MessageAlertComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
