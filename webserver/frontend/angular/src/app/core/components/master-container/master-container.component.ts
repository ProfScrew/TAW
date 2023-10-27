import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-master-container',
  templateUrl: './master-container.component.html',
  styleUrls: ['./master-container.component.css'],

})
export class MasterContainerComponent {
  showFiller = false;
  constructor(private router: Router, private auth : AuthService, private api : ApiService ) { }

  openDialog() {
    /*
    export interface iUserForm {
    username: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
    category?: iCategory['_id'][];
    room?: iRoom['_id'][];
    role: {
        admin: boolean;
        waiter: boolean;
        production: boolean;
        cashier: boolean;
        analytics: boolean;
    }
}
    */
    const data = {
      name: 'noob',
      surname: 'noob',
      phone: '12345678',
      password: 'password',
      role: {
        admin: true,
        waiter: false,
        production: false,
        cashier: false,
        analytics: false,
      }      
    }

    const a = this.api.put('/users/', data,"noob").subscribe((response) => {
      // Handle the response here
      console.log(response);
    });

  }

  exitApp() {
    this.auth.logout();
    this.router.navigate(['/login']); 
    //add losing session here
  }

}
