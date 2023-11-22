import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageInfoService {

  pageMessage: string = '';
  constructor() { }

  setPageMessage(message: string): void {
    this.pageMessage = message;
  }

  getPageMessage(): string {
    return this.pageMessage;
  }
}
