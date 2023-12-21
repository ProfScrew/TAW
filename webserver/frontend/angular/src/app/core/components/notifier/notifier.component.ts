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
    const toastTitle = title || 'Success Message';
    this.toastr.success(statuscode+": "+message, toastTitle, options);
  }

  showError(statuscode: number, message : string, title?: string, options?: any) {
    const toastTitle = title || 'Error Message';
    this.toastr.error(statuscode+": "+message, toastTitle, options);
  }

  showInfo(statuscode: number, message : string, title?: string, options?: any) {
    const toastTitle = title || 'Info Message';
    this.toastr.info(statuscode+": "+message, toastTitle, options);
  }

  showWarning(statuscode: number, message : string, title?: string, options?: any) {
    const toastTitle = title || 'Warning Message';
    this.toastr.warning(statuscode+": "+message, toastTitle,options);
  }
}
