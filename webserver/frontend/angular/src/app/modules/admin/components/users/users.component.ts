import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { eListenChannels, iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent {


  modelInput: iDynamicForm = {
    route: '/users',
    formName: 'newUser',
    textFields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'surname',
        label: 'Surname',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        value: '',
      },
    ],
    checkBoxes: {
      name: 'role',
      elements: [
        {
          name: 'admin',
          label: 'Admin',
          value: false,
        },
        {
          name: 'waiter',
          label: 'Waiter',
          value: false,
        },
        {
          name: 'production',
          label: 'Production',
          value: false,
        },
        {
          name: 'cashier',
          label: 'Cashier',
          value: false,
        },
        {
          name: 'analytics',
          label: 'Analytics',
          value: false,
        }
      ]
    },
    
    elementsFromDatabaseMultipleChoice: [
      {
        name: 'room',
        label: 'Rooms',
        route: '/rooms/',
        value: [],
      },
      
      {
        name: 'category',
        label: 'Categories',
        route: '/categories/',
        value: [],
      },
    ],
  }
  
  modelTable: iDynamicTable = {
    route: '/users/',
    tableListener: eListenChannels.users,
    archive: false,
    columns: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'surname',
        label: 'Surname',
        type: 'text',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
      },
    ],
    expandable: true,
    subModelInput: {
      ...this.modelInput as Partial<iDynamicTableForm>,
      formName: 'modifyUser',
      routeModify: '/users/',
      routeDelete: '/users/',

    }

  };
  
  

  constructor(private pageInfo: PageInfoService) {

  }
  
  ngOnInit(): void {
    Promise.resolve().then(() => this.pageInfo.setPageMessage("📃User Managment"));
    
  }




}
