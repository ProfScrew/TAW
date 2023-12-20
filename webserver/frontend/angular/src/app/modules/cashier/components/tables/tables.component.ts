import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent {

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  tableReference: iTable[] = [];
  roomReference: iRoom[] = [];

  subscriptionTable: Subscription | undefined;
  subscriptionRoom: Subscription | undefined;

  constructor(private references: DatabaseReferencesService, private pageInfo: PageInfoService) {

    this.subscriptionTable = this.references.tablesReferenceObservable.subscribe((value) => {
      this.tableReference = value!;
    });
    this.subscriptionRoom = this.references.roomsReferenceObservable.subscribe((value) => {
      this.roomReference = value!;
    });

    Promise.resolve().then(() => this.pageInfo.pageMessage = "🍴🪑Tables");
    
  }

  ngOnInit() {
    if(this.tableReference == undefined || this.roomReference == undefined){
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }else{

      this.tableReference.forEach((table) => {
        table.roomName = this.roomReference.find((room) => room._id == table.room)?.name;
      });
      this.displayedColumns = ['roomName', 'name','capacity', 'status'];
      this.dataSource = new MatTableDataSource(this.tableReference);
    }
  }

  ngAfterViewInit() {
    if(this.tableReference == undefined || this.roomReference == undefined){
      setTimeout(() => {
        this.ngAfterViewInit();
      }, 1000);
    }

    if (this.dataSource) {
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }
}
