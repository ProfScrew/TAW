import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-error',
  templateUrl: './httperror.component.html',
  styleUrls: ['./httperror.component.sass']
})

export class HTTPErrorComponent {
  errorCode: number = 404;
  errorName: string = 'Not found';
  errorDescription: string = 'The page you are looking for might have been removed had its name changed or is temporarily unavailable.';
  
  constructor(private titleService: Title) {
    this.titleService.setTitle(this.errorCode + ' ' + this.errorName);
  }

  goBack() {
    window.history.back();
  }
}
