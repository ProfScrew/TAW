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
  expandedElement: any | null; //used by table for expanding the row

  //used to check if a row is selected so we can emulate it
  //it its not used the table will emulate all the forms at the same time
  //this will cause some performance issues ? maybe ?
  selectedRowCheck: iRowCheck[] = []; // [ {name: "name", value: true}, {name: "surname", value: false}]  
  currentRow: string = ""; //check what row is selected so no need to check all the rows

  //used to pass the data to the form
  selectedRow: any | undefined;

  //dictionaries used to convert the id to the name
  singleChoiceReference: any[] = [];
  multipleChoiceReference: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  constructor(private api: ApiService, private socketService: SocketService) {

  }

  getTableData() {
    let route = this.model?.route!;
    if (this.model?.archive) {//this one is used to display the archived/shadowDeleted  data
      route = route + "?archive=false"
    }


    this.api.get(route).subscribe((data: any) => {//extract the data from the database

      for (const element of data.body.payload) {
        this.selectedRowCheck.push({ id: element._id, value: false });
      }

      this.dataSource = new MatTableDataSource(data.body.payload);

      //in the part below we create a dictionary that will be used to convert the id to the name
      //this is done because the user doesn't want to see the id but the name of the element

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
                  break; //ignore this part ;-;
                }
              }
              //structure of the dictionary
              //dictionary = [{name: "dictionaryname", dictionary: [{id: "id: name: "name"}]}]
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
      
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
    });
  }

  ngOnInit() {
    if (this.model == undefined) {
    } else {
      this.getTableData();
      this.buildTable();
      this.dataSource.sort = this.sort!;
    }

  }

  buildTable() {
    for (const column of this.model?.columns!) {
      this.displayedColumns.push(column.name);
    }
  }

  ngAfterViewInit() {// setting up the socket listener
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
    this.socketService.listen(this.model?.tableListener!).subscribe((data) => {
      // Update your UI as needed
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

  applyFilter(event: Event) {//filter the table (search bar)
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  selectRow(rowData: any) { //function called when a row is clicked
    //this if is used for the animation reasons... ¯\_(ツ)_/¯
    if (this.currentRow == rowData._id) {//click the same row so we close it 
      setTimeout(() => {
        this.currentRow = "";
        for (const element of this.selectedRowCheck) {
          element.value = false;
        }

      }, 300); // timeout to wait for the animation to finish and then close the row
    } else {//click a different row or new row
      this.currentRow = rowData._id;
      //console.log("rowcheck", this.selectedRowCheck)
      for (const element of this.selectedRowCheck) {
        if (element.id != rowData._id) {
          element.value = false;
        } else {
          element.value = true;
        }
      }
      this.setSelectedRowData(rowData); //set the data for the form
    }
  }

  setSelectedRowData(rowData: any) {
    //in this function we set the data for the form that will be used to modify the row when the user clicks on the record
    this.selectedRow = this.model?.subModelInput as iDynamicTableForm;
    this.selectedRow.formName = "modifyUser";


    if (rowData.username == undefined) { //use id as the primary key
      this.selectedRow.routeModify = this.model?.route! + rowData._id;
      this.selectedRow.routeDelete = this.model?.route! + rowData._id;

    } else {//route changes becouse in the user table we use the username as the primary key
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

    //converting name to id for single choice
    if (this.selectedRow.elementsFromDatabaseSingleChoice != undefined) {
      for (let element = 0; element < this.selectedRow.elementsFromDatabaseSingleChoice.length; element++) {
        let value = rowData[this.selectedRow.elementsFromDatabaseSingleChoice[element]?.name];
        for (let dictionary of this.singleChoiceReference[element]?.dictionary) {
          if (dictionary?.name == value) {
            value = dictionary?.id;
            break;
          }
        }
        if (this.selectedRow.elementsFromDatabaseSingleChoice[element]) {
          this.selectedRow.elementsFromDatabaseSingleChoice[element].value = value;
        }
      }
    }
    //converting name to id for multiple choice
    if (this.selectedRow.elementsFromDatabaseMultipleChoice != undefined) {
      for (let element = 0; element < this.selectedRow.elementsFromDatabaseMultipleChoice.length; element++) {
        let value = rowData[this.selectedRow.elementsFromDatabaseMultipleChoice[element]?.name];
        let temp: string[] = [];
        for (let dictionary of this.multipleChoiceReference[element]?.dictionary) {
          if (value.includes(dictionary?.name)) {
            temp.push(dictionary?.id);
          }
        }
        if (this.selectedRow.elementsFromDatabaseMultipleChoice[element]) {
          this.selectedRow.elementsFromDatabaseMultipleChoice[element].value = temp;
        }

      }
    }
  }
}
