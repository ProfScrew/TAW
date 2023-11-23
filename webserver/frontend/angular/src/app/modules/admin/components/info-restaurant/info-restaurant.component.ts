import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
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


  constructor(private pageInfo: PageInfoService) {
    Promise.resolve(null).then(() => this.pageInfo.pageMessage = '🏢Info restaurant');
  }
}
