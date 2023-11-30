import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { eListenChannels, iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  
    modelInput: iDynamicForm = {
      route: '/recipes',
      formName: 'newRecipe',
      textFields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          value: '',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          required: true,
          value: '',
        },
        {
          name: 'base_price',
          label: 'Price',
          type: 'number',
          required: true,
          value: '',
        },
      ],
      elementsFromDatabaseSingleChoice: [
        {
          name: 'category',
          label: 'Category',
          route: '/categories',
        },
      ],
      elementsFromDatabaseMultipleChoice: [
        {
          name: 'ingredients',
          label: 'Ingredients',
          route: '/ingredients',
        },
      ],
    };

    modelTable: iDynamicTable = {
      route: '/recipes/',
      archive: true,
      tableListener: eListenChannels.recipes,
      columns: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
        },
        {
          name: 'base_price',
          label: 'Price',
          type: 'number',
        },
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          subTable: true,
          subTableRoute: '/categories/',
        },
        {
          name: 'ingredients',
          label: 'Ingredients',
          type: 'array',
          subTable: true,
          subTableRoute: '/ingredients/',
        },
        
      ],
      expandable: false,
      subModelInput: {
        ...this.modelInput as Partial<iDynamicTableForm>,
        formName: 'modifyUser',
        routeModify: '/recipes/',
        routeDelete: '/recipes/',
      },
    };

    constructor(private pageInfo: PageInfoService){
      Promise.resolve().then(() => this.pageInfo.pageMessage = "📖Recipes");
    }
}
