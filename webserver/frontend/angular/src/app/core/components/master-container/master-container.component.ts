import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { PageInfoService } from '../../services/page-info.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DatabaseReferencesService } from '../../services/database-references.service';


@Component({
  selector: 'app-master-container',
  templateUrl: './master-container.component.html',
  styleUrls: ['./master-container.component.css'],
})
export class MasterContainerComponent {
  @ViewChild('drawer') drawer!: MatDrawer;


  items = [
    { name: 'Admin', subItems: ['Users', 'Categories', 'Recipes', 'Ingredients', "Info Restaurant", 'Rooms', 'Tables'],
    subLinks: ['/core/admin/users', '/core/admin/categories', '/core/admin/recipes','/core/admin/ingredients', '/core/admin/info-restaurant', '/core/admin/rooms', '/core/admin/tables'] },
    { name: 'Waiter', subItems: ['Orders'], subLinks : ['/core/waiter/orders'] },
    { name: 'Production', subItems: ['Queue'], subLinks: ['/core/production/queue'] },
    { name: 'Cashier', subItems: ['Cashout'], subLinks: ['/core/cashier/cashout'] },
    { name: 'Analytics', subItems: ['Statistics'], subLinks: ['/core/analytics/statistics'] },
  ];

  showFiller = true;
  constructor(private router: Router, private auth: AuthService, private api: ApiService, protected pageInfo: PageInfoService, private databaseReferences: DatabaseReferencesService) {
    databaseReferences.initializeAllReferences();
  }

  isSubItem(item: any): boolean {
    return item.subItems && item.subItems.length > 0;
  }

  isValidRole(item: string) {
    return (this.auth.role as any)[item.toLowerCase()];
  }

  isWaiter() {
    return this.auth.role['waiter'];
  }

  closeDrawer() {
    this.drawer.close();
  }

  exitApp() {
    this.auth.logout();
    this.router.navigate(['/login']); 
    //add losing session here
  }

}

