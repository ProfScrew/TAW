import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';


export interface iRowCheck {
  id: string;
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

  singleChoiceReference: any[] = [];
  multipleChoiceReference: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  constructor(private api: ApiService, private socketService: SocketService) {

  }

  getTableData() {
    let route = this.model?.route!;
    if (this.model?.archive) {// decide if the user can see the data TODO
      route = route + "?archive=false"
    }


    this.api.get(route).subscribe((data: any) => {

      for (const element of data.body.payload) {
        this.selectedRowCheck.push({ id: element._id, value: false });
      }
      //console.log("what=?",this.selectedRowCheck)

      this.dataSource = new MatTableDataSource(data.body.payload);
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
      console.log("table data", this.dataSource)
      if (this.model?.subModelInput?.elementsFromDatabaseSingleChoice != undefined) { //substitutes the id with the name
        for (let single of this.model?.subModelInput?.elementsFromDatabaseSingleChoice!) {
          this.api.get(single.route).subscribe((data: any) => {
            this.singleChoiceReference.push({ name: single.name, dictionary: [] });
            for (let dictionary of data.body.payload) {
              this.singleChoiceReference[this.singleChoiceReference.length - 1].dictionary.push({ id: dictionary._id, name: dictionary.name });
            }
            this.dataSource.filteredData.forEach((element: any) => {
              for (let b of this.singleChoiceReference[this.singleChoiceReference.length - 1].dictionary) {
                if (b.id == element[single.name]) {
                  element[single.name] = b.name;
                  console.log("element found adn changesd", element)
                  break; //ignore this part ;-;
                }
              }
              // name: "name", descriptiosn: "description", category: "category", ingredients: "ingredients"
            });
          });
        }
      }
      if (this.model?.subModelInput?.elementsFromDatabaseMultipleChoice != undefined) { //substitutes the id with the name
        for (let multiple of this.model?.subModelInput?.elementsFromDatabaseMultipleChoice!) {
          this.api.get(multiple.route).subscribe((data: any) => {
            this.multipleChoiceReference.push({ name: multiple.name, dictionary: [] });
            for (let dictionary of data.body.payload) {
              this.multipleChoiceReference[this.multipleChoiceReference.length - 1].dictionary.push({ id: dictionary._id, name: dictionary.name });
            }
            this.dataSource.filteredData.forEach((element: any) => {//check if this works as intended
              let temp: string[] = [];
              for (let b of this.multipleChoiceReference[this.multipleChoiceReference.length - 1].dictionary) {
                if (element[multiple.name].includes(b.id)) {
                  temp.push(b.name);
                }
              }
              element[multiple.name] = temp;
            });
          });
        }
      }
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
    this.socketService.joinRoom('admin');
    console.log("table listener", this.model?.tableListener)
    this.socketService.listen(this.model?.tableListener!).subscribe((data) => {
      console.log('User list updated:', data);
      // Update your UI as needed
      //TODO UPDATE TABLE SO THAT I DON'T HAVE DUPLICATES
      this.selectedRowCheck = [];
      this.dataSource = new MatTableDataSource();
      setTimeout(() => {// wait for the animation to finish
        this.currentRow = "";
        for (const element of this.selectedRowCheck) {
          element.value = false;
        }
      }, 300);
      this.getTableData();
    });
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
    if (this.currentRow == rowData._id) {
      setTimeout(() => {// wait for the animation to finish
        this.currentRow = "";
        for (const element of this.selectedRowCheck) {
          element.value = false;
        }

      }, 300);
    } else {
      this.currentRow = rowData._id;
      console.log("rowcheck", this.selectedRowCheck)
      for (const element of this.selectedRowCheck) {
        if (element.id != rowData._id) {
          element.value = false;
        } else {
          element.value = true;
        }
      }
      this.setSelectedRowData(rowData);
    }
    //console.log('Row Data Passed from table', rowData); // Example: Log the clicked row data
  }

  setSelectedRowData(rowData: any) {

    this.selectedRow = this.model?.subModelInput as iDynamicTableForm;
    this.selectedRow.formName = "modifyUser";
    

    if (rowData.username == undefined) { // all other cases
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
      this.selectedRow.arrayTextFields!.value = rowData[this.selectedRow.arrayTextFields!.name];
    }
    //substitutes the name with the id TODO

    if (this.selectedRow.elementsFromDatabaseSingleChoice != undefined) {
      for (let element of this.selectedRow.elementsFromDatabaseSingleChoice!) {
        element.value = rowData[element.name];
      }
    }
    //substitutes the name with the id TODO
    if (this.selectedRow.elementsFromDatabaseMultipleChoice != undefined) {
      for (let element of this.selectedRow.elementsFromDatabaseMultipleChoice!) {
        element.value = rowData[element.name];
      }
    }
  }
}
