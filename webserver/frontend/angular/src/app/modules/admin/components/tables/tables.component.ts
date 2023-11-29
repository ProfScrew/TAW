import { Component } from '@angular/core';
import { eListenChannels } from 'src/app/core/models/channels.enum';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import {  iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent {

  modelInput: iDynamicForm = {
    route: '/tables',
    formName: 'newTable',
    textFields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'capacity',
        label: 'Capacity',
        type: 'number',
        required: true,
        value: '',
      },
      
    ],

    elementsFromDatabaseSingleChoice: [
      {
        name: 'room',
        label: 'Room',
        route: '/rooms/',
      },
    ],

  };

  modelTable: iDynamicTable = {
    route: '/tables/',
    archive: false,
    tableListener: eListenChannels.tables,
    columns: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'capacity',
        label: 'Capacity',
        type: 'text',
      },
      {
        name: 'room',
        label: 'Room',
        type: 'text',
        subTable: true,
        subTableRoute: '/rooms/',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'text',
      }
      
    ],
    expandable: false,
    
    subModelInput: {
      ...this.modelInput as Partial<iDynamicTableForm>,
      formName: 'modifyTable',
      routeModify: '/tables/',
      routeDelete: '/tables/',

    }

  }

  constructor(private pageInfo:PageInfoService) {
    Promise.resolve(null).then(() => this.pageInfo.pageMessage = "🪑Tables");
  }
}
