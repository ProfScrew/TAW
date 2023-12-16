import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageInfoService {

  pageMessage: string = '';
  currentBreakpoint: string = '';

  constructor() { }

  setPageMessage(message: string): void {
    this.pageMessage = message;
  }
  
  setCurrentBreakpoint(breakpoint: string): void {
    this.currentBreakpoint = breakpoint;
  }

  getPageMessage(): string {
    return this.pageMessage;
  }

  getCurrentBreakpoint(): string {
    return this.currentBreakpoint;
  }
}
