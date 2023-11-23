import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { authGuard, eRole } from 'src/app/core/guards/auth.guard';// import the AuthGuard class
import { InfoRestaurantComponent } from './components/info-restaurant/info-restaurant.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { TablesComponent } from './components/tables/tables.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: 'info-restaurant',
    component: InfoRestaurantComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: 'rooms',
    component: RoomsComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [authGuard], // use the AuthGuard class
    data : { type: eRole.Admin }
  },
  {
    path: '', 
    redirectTo: 'users',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
