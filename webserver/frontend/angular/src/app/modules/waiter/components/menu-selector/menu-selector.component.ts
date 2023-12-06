import { Component } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { iTempDish, iTempOrder } from '../../models/order.model';
import { Subscription } from 'rxjs';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { iRecipe } from 'src/app/core/models/recipe.model';
import { iIngredient } from 'src/app/core/models/ingredient.model';
import { iCategory } from 'src/app/core/models/category.model';
import { eDishModificationType, eDishStatus } from 'src/app/core/models/dish.model';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';

@Component({
  selector: 'app-menu-selector',
  templateUrl: './menu-selector.component.html',
  styleUrls: ['./menu-selector.component.css']
})
export class MenuSelectorComponent {

  receivedData: iTempOrder | undefined;

  categoryReference: iCategory[] | undefined;
  subscriptionCategory: Subscription | undefined;
  ingredientReference: iIngredient[] | undefined;
  subscriptionIngredient: Subscription | undefined;
  recipeReference: iRecipe[] | undefined;
  subscriptionRecipe: Subscription | undefined;

  displayedRecipe: iRecipe[] | undefined;

  tempDishes: iTempDish[] = [];

  modificationsArray = ['add', 'remove', 'more', 'less'];


  constructor(private pagedata: PageDataService, private dataReference: DatabaseReferencesService, private notifier: NotifierComponent) {
    this.subscriptionIngredient = this.dataReference.ingredientsReferenceObservable.subscribe((value) => {
      this.ingredientReference = value;
      this.substituteIngredient();
    });
    this.subscriptionCategory = this.dataReference.categoriesReferenceObservable.subscribe((value) => {
      this.categoryReference = value;
      this.substituteIngredient();

    });
    this.subscriptionRecipe = this.dataReference.recipesReferenceObservable.subscribe((value) => {
      this.recipeReference = value;
      this.substituteIngredient();
    });
  }

  substituteIngredient() {
    this.displayedRecipe = this.recipeReference!;
    if (this.displayedRecipe) {
      this.displayedRecipe.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient, index) => {
          const ingredientReference = this.ingredientReference?.find((ingredientReference) => ingredientReference._id === ingredient);
          if (ingredientReference) {
            this.displayedRecipe!.forEach((recipe) => {
              recipe.ingredients[index] = ingredientReference.name!;
            });
          }
        });
      });
    }
  }


  ngOnInit(): void {
    this.receivedData = this.pagedata.data;

  }

  ngOnDestroy(): void {
    this.subscriptionCategory?.unsubscribe();
    this.subscriptionIngredient?.unsubscribe();
    this.subscriptionRecipe?.unsubscribe();
  }
  addCourse(recipeAdded: iRecipe) {
    let tempDish: iTempDish = {
      recipe: recipeAdded._id,
      actual_price: recipeAdded.base_price,
      status: eDishStatus.waiting,
      name: recipeAdded.name,
      description: recipeAdded.description,
      ingredients: recipeAdded.ingredients,
      modifications: [],
      //form
      formNotes: new FormGroup({}),
      formIngredients: new FormGroup({}),
    };
    tempDish.formNotes?.addControl('notes', new FormControl());

    tempDish.formIngredients?.addControl('ingredients', new FormControl({}));
    tempDish.formIngredients?.addControl('type', new FormControl({}));
    this.tempDishes.push(tempDish);
    console.log(this.tempDishes);
  }
  onAddNote(index: number) {
    this.tempDishes[index].notes = this.tempDishes[index].formNotes?.value.notes;

  }

  onAddIngredient(index: number) {
    console.log(index)
    let tempName = this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients)?.name!;
    let tempPrice = 0;
    //calculate modification price through ingredient price
    switch (this.tempDishes[index].formIngredients?.value.type) {
      case eDishModificationType.add:
        tempPrice = this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients)?.modification_price!;
        break;
      case eDishModificationType.remove:
        console.log("modification object", this.tempDishes[index])
        if (this.tempDishes[index].ingredients?.includes(tempName)) {
          tempPrice = - (this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients)?.modification_price!);
          console.log("tempPrice", tempPrice)
        } else {
          this.notifier.showError(400, "Ingredient not present in the dish")
          return;
        }
        break;
      case eDishModificationType.more:
        let tempIngredient = this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients);
        tempPrice = ((tempIngredient?.modification_percentage! * tempIngredient?.modification_price!) / 100);

        break;
      case eDishModificationType.less:
        if (this.tempDishes[index].ingredients?.includes(tempName)) {
          let tempIngredient = this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients);
          tempPrice = - ((tempIngredient?.modification_percentage! * tempIngredient?.modification_price!) / 100);
        } else {
          this.notifier.showError(400, "Ingredient not present in the dish")
          return;
        }
        break;
      default:
        this.notifier.showError(400, "Invalid modification type")
        return;
        break;
    }

    this.tempDishes[index].modifications?.push({
      ingredient: this.tempDishes[index].formIngredients?.value.ingredients,
      name: tempName,
      type: this.tempDishes[index].formIngredients?.value.type,
      price_modification: tempPrice,
      //TODO: change price of the dish according to the modification
    });



  }
  removeIngredient(dish: number, element: number) {
    this.tempDishes[dish].modifications?.splice(element, 1);
  }

  removeCourse(index: number) {
    this.tempDishes.splice(index, 1);
  }
  sendData() {
    throw new Error('Method not implemented.');
  }
}
