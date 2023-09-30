import { Component } from '@angular/core';

@Component({
  selector: 'hidden-interaction',
  standalone: true,
  template: '',
  styleUrls: []
})
export class UserInteractionComponent {
  tap_duration:  number = 20;
  hold_duration: number = 70;
  error_pattern: number[] = [0, 50, 50, 50, 50, 50, 50, 50, 50, 50];

  onTap(event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    // Get navigator permission for vibration
    if (!window.navigator.vibrate) {
      // Request permission for vibration
      // @ts-ignore
      window.navigator.vibrate = window.navigator.vibrate || window.navigator.webkitVibrate || window.navigator.mozVibrate || window.navigator.msVibrate;
    }

    if (window.navigator.vibrate) {
      window.navigator.vibrate(this.tap_duration);
    }
  }

  onLongPress(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    
    // Get navigator permission for vibration
    if (!window.navigator.vibrate) {
      // Request permission for vibration
      // @ts-ignore
      window.navigator.vibrate = window.navigator.vibrate || window.navigator.webkitVibrate || window.navigator.mozVibrate || window.navigator.msVibrate;
    }

    if (window.navigator.vibrate) {
      window.navigator.vibrate(this.hold_duration);
    }
  }

  onError(): void {
    // Get navigator permission for vibration
    if (!window.navigator.vibrate) {
      // Request permission for vibration
      // @ts-ignore
      window.navigator.vibrate = window.navigator.vibrate || window.navigator.webkitVibrate || window.navigator.mozVibrate || window.navigator.msVibrate;
    }

    if (window.navigator.vibrate) {
      window.navigator.vibrate(this.error_pattern);
    }
  }
}
