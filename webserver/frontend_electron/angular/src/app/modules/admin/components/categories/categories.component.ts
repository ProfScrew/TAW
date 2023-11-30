import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { eListenChannels, iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  modelInput: iDynamicForm = {
    route: '/categories',
    formName: 'newCategory',
    textFields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'color',
        label: 'Color',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'order',
        label: 'Order',
        type: 'number',
        required: false,
        value: '',
      }
    ],
  };

  modelTable: iDynamicTable = {
    route: '/categories/',
    archive: false,
    tableListener: eListenChannels.categories,
    columns: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'color',
        label: 'Color',
        type: 'text',
      },
      {
        name: 'order',
        label: 'Order',
        type: 'text',
      },
      
    ],
    expandable: false,
    subModelInput: {
      ...this.modelInput as Partial<iDynamicTableForm>,
      formName: 'modifyUser',
      routeModify: '/categories/',
      routeDelete: '/categories/',
    },
  }


  constructor(private pageInfo: PageInfoService){
    Promise.resolve().then(() => this.pageInfo.pageMessage = "🥙Categories");
  }
}
