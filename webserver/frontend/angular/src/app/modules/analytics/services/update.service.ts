import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private booleanValueSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  get booleanValue$() {
    return this.booleanValueSubject.asObservable();
  }

  updateBooleanValue(newValue: boolean) {
    this.booleanValueSubject.next(newValue);
  }
  constructor() { }
}
