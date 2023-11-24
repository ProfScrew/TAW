import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent {
  modelInput: iDynamicForm = {
    route: '/ingredients',
    formName: 'newIngredient',
    textFields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'modification_price',
        label: 'Modification Price',
        type: 'number',
        required: true,
        value: '',
      },
      {
        name: 'modification_percentage',
        label: 'Modification Percentage',
        type: 'number',
        required: true,
        value: '',
      },
    ],
    arrayTextFields:
    {
      name: 'alergens',
      label: 'Allergens',
    }

  };

  modelTable: iDynamicTable = {
    route: '/ingredients/',
    shadow: false,
    columns: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'modification_price',
        label: 'Modification Price',
        type: 'text',
      },
      {
        name: 'modification_percentage',
        label: 'Modification Percentage',
        type: 'text',
      },
      {
        name: 'alergens',
        label: 'Allergens',
        type: 'text',
      },
      
    ],
    expandable: false,

  }

  constructor(private pageInfo: PageInfoService) {
    Promise.resolve().then(() => this.pageInfo.pageMessage = "🍎Ingredients");
  }


}