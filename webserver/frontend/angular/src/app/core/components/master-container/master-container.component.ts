import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-master-container',
  templateUrl: './master-container.component.html',
  styleUrls: ['./master-container.component.css'],

})
export class MasterContainerComponent {
  showFiller = false;
  constructor(private router: Router, private auth : AuthService ) { }

  exitApp() {
    this.auth.logout();
    this.router.navigate(['/login']); 
    //add losing session here
  }
}
