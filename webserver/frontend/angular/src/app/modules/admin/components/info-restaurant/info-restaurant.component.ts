import { Component } from '@angular/core';
import { eListenChannels } from 'src/app/core/models/channels.enum';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import {  iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-info-restaurant',
  templateUrl: './info-restaurant.component.html',
  styleUrls: ['./info-restaurant.component.css']
})

export class InfoRestaurantComponent {
  modelInput: iDynamicForm = {
    route: '/restaurant_informations',
    formName: 'newRestaurant',
    textFields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'address',
        label: 'Address',
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
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'logo',
        label: 'Logo',
        type: 'text',
        required: false,
        value: '',
      },
      {
        name: 'iva',
        label: 'Iva',
        type: 'string',
        required: true,
        value: '',
      },
      {
        name: 'charge_per_person',
        label: 'Charge per person',
        type: 'number',
        required: true,
        value: '',
      }
    ],
  };

  modelTable: iDynamicTable = {
    route: '/restaurant_informations/',
    archive: false,
    tableListener: eListenChannels.restaurantInformation,
    columns: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'address',
        label: 'Address',
        type: 'text',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
      },
      {
        name: 'logo',
        label: 'Logo',
        type: 'text',
      },
      {
        name: 'iva',
        label: 'Iva',
        type: 'string',
      },
      {
        name: 'charge_per_person',
        label: 'Charge per person',
        type: 'number',
      },
      
    ],
    expandable: false,
    subModelInput: {
      ...this.modelInput as Partial<iDynamicTableForm>,
      formName: 'modifyUser',
      routeModify: '/users/',
      routeDelete: '/users/',
    },

  }

  constructor(private pageInfo: PageInfoService) {
    Promise.resolve(null).then(() => this.pageInfo.pageMessage = '🏢Info restaurant');
  }
}
