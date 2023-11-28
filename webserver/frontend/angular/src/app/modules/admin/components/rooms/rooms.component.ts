import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { eListenChannels, iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  modelInput: iDynamicForm = {
    route: '/rooms',
    formName: 'newRoom',
    textFields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
    ],
  };
  modelTable: iDynamicTable = {
    route: '/rooms/',
    archive: false,
    tableListener: eListenChannels.rooms,
    columns: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      
    ],
    expandable: false,
    
    subModelInput: {
      ...this.modelInput as Partial<iDynamicTableForm>,
      formName: 'modifyUser',
      routeModify: '/rooms/',
      routeDelete: '/rooms/',
    },
    
  }
    
  constructor(private pageInfo: PageInfoService) {
    Promise.resolve(null).then(() => this.pageInfo.pageMessage = "🚪Rooms");
  }
}
