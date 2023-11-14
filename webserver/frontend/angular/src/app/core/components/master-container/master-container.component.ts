import { Component, ViewChild } from '@angular/core';
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
  items = [
    { name: 'Admin', subItems: ['Users', 'Recipes', "Info Restaurant"] },
    { name: 'Production', subItems: [] },
    { name: 'Waiter', subItems: [] },
    { name: 'Cashier', subItems: [] },
    { name: 'Analytics', subItems: [] },
  ];

  showFiller = true;
  constructor(private router: Router, private auth: AuthService, private api: ApiService) {
  }




  isSubItem(item: any): boolean {
    return item.subItems && item.subItems.length > 0;
  }



  exitApp() {
    this.auth.logout();
    this.router.navigate(['/login']); 
    //add losing session here
  }

}

