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

  showSuccess(message: string, title?: string, options?: any) {
    this.toastr.success(message, title, options);
  }

  showError(message: string, title?: string, options?: any) {
    this.toastr.error(message, title, options);
  }

  showWarning(message: string, title?: string, options?: any) {
    this.toastr.warning(message, title, options);
  }

  showInfo(message: string, title?: string, options?: any) {
    this.toastr.info(message, title, options);
  }
}
