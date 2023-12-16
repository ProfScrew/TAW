import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private pageData: any;

  constructor() {}

  get data(): any {
    return this.pageData;
  }

  set data(pageData: any) {
    this.pageData = pageData;
  }

}
