import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iUser, iUserTable } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';

export interface iRowCheck {
  name: string;
  value: boolean;
}[]

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DynamicTableComponent {
  @Input() model: iDynamicTable | undefined;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  expandedElement: any | null;
  selectedRowCheck: iRowCheck[] = []; // [ {name: "name", value: true}, {name: "surname", value: false}]
  selectedRow: any | undefined;
  currentRow: string = "";

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

      for (const element of data.body.payload) {
        this.selectedRowCheck.push({ name: element.name, value: false });
      }
      console.log(this.selectedRowCheck)

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
    for (const column of this.model?.columns!) {
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

  selectRow(rowData: any) {
    // Your logic when a row is clicked
    if (this.currentRow == rowData.name) {
      setTimeout(() => {// wait for the animation to finish
        this.currentRow = "";
        for (const element of this.selectedRowCheck) {
          element.value = false;
        }

      }, 300);
    } else {
      this.currentRow = rowData.name;
      console.log(this.selectedRowCheck[rowData.name])
      for (const element of this.selectedRowCheck) {
        if (element.name != rowData.name) {
          element.value = false;
        } else {
          element.value = true;
        }
      }
      this.setSelectedRowData(rowData);
    }
    console.log('Hello World!', rowData); // Example: Log the clicked row data
  }

  setSelectedRowData(rowData: any) {

    this.selectedRow = this.model?.subModelInput as iDynamicTableForm;
    this.selectedRow.formName = "modifyUser";
    if (rowData._id != undefined) { // all other cases
      this.selectedRow.routeModify = this.model?.route! + rowData._id;
      this.selectedRow.routeDelete = this.model?.route! + rowData._id;
    } else { // case for users
      this.selectedRow.routeModify = this.model?.route! + rowData.username;
      this.selectedRow.routeDelete = this.model?.route! + rowData.username;
    }

    for (let element of this.selectedRow.textFields!) {
      element.value = rowData[element.name];
    }
    if (this.selectedRow.checkBoxes != undefined) {
      for (let element of this.selectedRow.checkBoxes!.elements) {
        element.value = rowData[this.selectedRow?.checkBoxes!.name][element.name];
      }
    }

    if (this.selectedRow.arrayTextFields != undefined) {
      console.log("array text fields", this.selectedRow.arrayTextFields)
      this.selectedRow.arrayTextFields!.value = rowData[this.selectedRow.arrayTextFields!.name];
    }
    if (this.selectedRow.arrayCheckBoxes != undefined) {
      if (this.selectedRow.elementsFromDatabaseSingleChoice != undefined) {
        this.selectedRow.elementsFromDatabaseSingleChoice!.value = rowData[this.selectedRow.elementsFromDatabaseSingleChoice!.name];
      }
    }
    if (this.selectedRow.elementsFromDatabaseMultipleChoice != undefined) {
      for (let element of this.selectedRow.elementsFromDatabaseMultipleChoice!) {
        element.value = rowData[element.name];
      }
    }
  }
}
