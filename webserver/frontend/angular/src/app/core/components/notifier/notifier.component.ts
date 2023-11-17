import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  showSuccess(statuscode: number, message : string, title?: string, options?: any) {
    this.toastr.success(statuscode+": "+message, title, options);
  }

  showError(statuscode: number, message : string, title?: string, options?: any) {
    this.toastr.error(statuscode+": "+message, title, options);
  }

  showInfo(statuscode: number, message : string, title?: string, options?: any) {
    this.toastr.info(statuscode+": "+message, title, options);
  }

  showWarning(statuscode: number, message : string, title?: string, options?: any) {
    this.toastr.warning(statuscode+": "+message, title, options);
  }
}
