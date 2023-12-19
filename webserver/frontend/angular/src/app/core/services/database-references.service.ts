import { Injectable } from '@angular/core';
import { iIngredient } from '../models/ingredient.model';
import { iRecipe } from '../models/recipe.model';
import { iRoom } from '../models/room.model';
import { iTable } from '../models/table.model';
import { iCategory } from '../models/category.model';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { io } from 'socket.io-client';
import { eListenChannels } from '../models/channels.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseReferencesService {

  //private archived = "?archive=false";
  private archived = "";
  
  private categoriesReference : BehaviorSubject<iCategory[] | undefined> = new BehaviorSubject<iCategory[] | undefined>(undefined);
  public categoriesReferenceObservable = this.categoriesReference.asObservable();

  private ingredientsReference : BehaviorSubject<iIngredient[] | undefined> = new BehaviorSubject<iIngredient[] | undefined>(undefined);
  public ingredientsReferenceObservable = this.ingredientsReference.asObservable();

  private recipesReference : BehaviorSubject<iRecipe[] | undefined> = new BehaviorSubject<iRecipe[] | undefined>(undefined);
  public recipesReferenceObservable = this.recipesReference.asObservable();

  private roomsReference : BehaviorSubject<iRoom[] | undefined> = new BehaviorSubject<iRoom[] | undefined>(undefined);
  public roomsReferenceObservable = this.roomsReference.asObservable();

  private tablesReference : BehaviorSubject<iTable[] | undefined> = new BehaviorSubject<iTable[] | undefined>(undefined);
  public tablesReferenceObservable = this.tablesReference.asObservable();



  constructor(private api: ApiService, private io: SocketService) {
  }

  initializeAllReferences() {
    this.getCategoriesReference();
    this.getIngredientsReference();
    this.getRecipesReference();
    this.getRoomsReference();
    this.getTablesReference();

    this.initializeListeners();
  }

  initializeListeners() {
    this.io.listen(eListenChannels.categories).subscribe((response) => {
      this.getCategoriesReference();
    });
    this.io.listen(eListenChannels.ingredients).subscribe((response) => {
      this.getIngredientsReference();
    });
    this.io.listen(eListenChannels.recipes).subscribe((response) => {
      this.getRecipesReference();
    });

    this.io.listen(eListenChannels.rooms).subscribe((response) => {
      this.getRoomsReference();
    });
    this.io.listen(eListenChannels.tables).subscribe((response) => {
      this.getTablesReference();
    });
  }


  getCategoriesReference() {
    this.api.get('/categories').subscribe((response) => {
      this.categoriesReference.next(response.body.payload);
    });
  }
  getIngredientsReference() {
    this.api.get('/ingredients' + this.archived).subscribe((response) => {
      this.ingredientsReference.next(response.body.payload)
    });
  }
  getRecipesReference() {
    this.api.get('/recipes' + this.archived).subscribe((response) => {
      this.recipesReference.next(response.body.payload);
    });
  }

  getRoomsReference() {
    this.api.get('/rooms').subscribe((response) => {
      this.roomsReference.next(response.body.payload);
    });
  }
  getTablesReference() {
    this.api.get('/tables').subscribe((response) => {
      console.log("UPDATE TABLES ",response);
      this.tablesReference.next(response.body.payload);
    });
  }








}
