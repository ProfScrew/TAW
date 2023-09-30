import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TableComponent }  from 'src/app/components/table/table.component';
import { ModalComponent, ModalOption }  from 'src/app/components/modal/modal.component';
import { NavigationComponent } from 'src/app/components/navigation/navigation.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Table, TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.sass'],
  providers: [
    TableComponent,
    ModalComponent,
    NavigationComponent
  ]
})
export class WaiterTablesComponent implements AfterViewInit {
  items: Table[] = [];


  private update_tables() {
    this.ts.get_all().subscribe({
      next: (data) => {
        if (data.error) { return console.error(data.message); }
        this.items = data.payload; 
      },
      error: (err) => { console.error(err); }
    });
  }
  

  constructor(private ts: TableService, private access: AuthService, router: Router) {
    if (!access.has_token) router.navigate(['/login']);
  }

  @ViewChild(ModalComponent)    modal?:  ModalComponent;
  @ViewChildren(TableComponent) tables?: QueryList<TableComponent>;

  ngAfterViewInit() {
    this.update_tables();
  }
}
