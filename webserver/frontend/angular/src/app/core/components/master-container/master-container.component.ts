import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-master-container',
  templateUrl: './master-container.component.html',
  styleUrls: ['./master-container.component.css'],

})
export class MasterContainerComponent {
  showFiller = false;
  constructor(private router: Router) { }

  navigateToDashboard() {
    this.router.navigate(['/login']); 
    //add losing session here
  }
}
