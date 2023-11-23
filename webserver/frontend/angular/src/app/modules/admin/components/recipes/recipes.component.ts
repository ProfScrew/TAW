import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
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


    constructor(private pageInfo: PageInfoService){
      Promise.resolve().then(() => this.pageInfo.pageMessage = "📖Recipes");
    }
}
