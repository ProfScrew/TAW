import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iUser, iUserTable } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SocketService } from 'src/app/core/services/socket.service';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
  ],
})
export class DynamicTableComponent {
  @Input() model: iDynamicTable | undefined;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  constructor(private api: ApiService, private socketService: SocketService) {
    this.socketService.joinRoom('admin');
    this.socketService.listen('userListUpdated').subscribe((data) => {
      console.log('User list updated:', data);
      // Update your UI as needed
      this.getTableData();
    });
  }
  
  getTableData() {
    this.api.get(this.model?.route!).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.body.payload);
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
      
    });
  }

  ngOnInit() {
    
    console.log(this.model)
    if (this.model == undefined) {
      console.log("model is undefined");
    } else {
      this.getTableData();
      this.buildTable();
    }
    
  }

  buildTable() {
    for(const column of this.model?.columns!){
      this.displayedColumns.push(column.name);
    }

  }

  ngAfterViewInit() {
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
