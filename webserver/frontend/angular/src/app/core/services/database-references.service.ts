import { Injectable } from '@angular/core';
import { iIngredient } from '../models/ingredient.model';
import { iRecipe } from '../models/recipe.model';
import { iRoom } from '../models/room.model';
import { iTable } from '../models/table.model';
import { iCategory } from '../models/category.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseReferencesService {
  categoriesReference : iCategory[] | undefined;
  ingredientsReference : iIngredient[] | undefined;
  recipesReference : iRecipe[] | undefined;

  roomsReference : iRoom[] | undefined;
  tablesReference : iTable[] | undefined;



  constructor(private api: ApiService) {
  }

  initializeAllReferences(){
    this.api.get('/categories').subscribe((responce) => {
      this.categoriesReference = responce.body.payload;
      
    console.log("categoriesReference",this.categoriesReference);
    });
    this.api.get('/ingredients').subscribe((responce) => {
      this.ingredientsReference = responce.body.payload;
    });
    this.api.get('/recipes').subscribe((responce) => {
      this.recipesReference = responce.body.payload;
    });

    this.api.get('/rooms').subscribe((responce) => {
      this.roomsReference = responce.body.payload;
    });
    this.api.get('/tables').subscribe((responce) => {
      this.tablesReference = responce.body.payload;
    });

    
  }











  setCategoriesReference(categories: iCategory[]) {
    this.categoriesReference = categories;
  }
  setIngredientsReference(ingredients: iIngredient[]) {
    this.ingredientsReference = ingredients;
  }
  setRecipesReference(recipes: iRecipe[]) {
    this.recipesReference = recipes;
  }

  setRoomsReference(rooms: iRoom[]) {
    this.roomsReference = rooms;
  }
  setTablesReference(tables: iTable[]) {
    this.tablesReference = tables;
  }

  getCategoriesReference() {
    return this.categoriesReference;
  }
  getIngredientsReference() {
    return this.ingredientsReference;
  }
  getRecipesReference() {
    return this.recipesReference;
  }

  getRoomsReference() {
    return this.roomsReference;
  }
  getTablesReference() {
    return this.tablesReference;
  }



}
