import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './components/users/users.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule} from '@angular/material/expansion';
import { InfoRestaurantComponent } from './components/info-restaurant/info-restaurant.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { TablesComponent } from './components/tables/tables.component';


import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';



import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicTableFormComponent } from './components/dynamic-table-form/dynamic-table-form.component';





@NgModule({
  declarations: [
    UsersComponent,
    InfoRestaurantComponent,
    RecipesComponent,
    IngredientsComponent,
    CategoriesComponent,
    RoomsComponent,
    TablesComponent,
    DynamicTableComponent,
    DynamicFormComponent,
    DynamicTableFormComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    
  ],
  exports: [
    DynamicFormComponent,
    DynamicTableComponent,
    DynamicTableFormComponent,
  ]
})
export class AdminModule { }
