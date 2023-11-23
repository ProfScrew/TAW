import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { PageInfoService } from '../../services/page-info.service';

@Component({
  selector: 'app-master-container',
  templateUrl: './master-container.component.html',
  styleUrls: ['./master-container.component.css'],

})
export class MasterContainerComponent {
  items = [
    { name: 'Admin', subItems: ['Users', 'Categories', 'Recipes', 'Ingredients', "Info Restaurant", 'Rooms', 'Tables'],
    subLinks: ['/core/admin/users', '/core/admin/categories', '/core/admin/recipes','/core/admin/ingredients', '/core/admin/info-restaurant', '/core/admin/rooms', '/core/admin/tables'] },
    { name: 'Production', subItems: [], subLinks: [] },
    { name: 'Waiter', subItems: [], subLinks : [] },
    { name: 'Cashier', subItems: [], subLinks: [] },
    { name: 'Analytics', subItems: [], subLinks: [] },
  ];

  showFiller = true;
  constructor(private router: Router, private auth: AuthService, private api: ApiService, protected pageInfo: PageInfoService) {
    
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

