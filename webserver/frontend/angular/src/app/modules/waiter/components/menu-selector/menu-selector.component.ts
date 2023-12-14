import { Component, HostListener } from '@angular/core';
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
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { eOrderStatus } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-menu-selector',
  templateUrl: './menu-selector.component.html',
  styleUrls: ['./menu-selector.component.css']
})
export class MenuSelectorComponent {

  receivedData: iTempOrder | undefined;
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.changeOrderStatus();
  }

  categoryReference: iCategory[] | undefined;
  subscriptionCategory: Subscription | undefined;
  ingredientReference: iIngredient[] | undefined;
  subscriptionIngredient: Subscription | undefined;
  recipeReference: iRecipe[] | undefined;
  subscriptionRecipe: Subscription | undefined;

  displayedRecipe: iRecipe[] | undefined;

  tempDishes: iTempDish[] = [];

  modificationsArray = ['add', 'remove', 'more', 'less'];


  constructor(private api: ApiService, private pagedata: PageDataService, private dataReference: DatabaseReferencesService, private notifier: NotifierComponent, private router: Router) {
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
    this.receivedData = { ... this.pagedata.data };
    console.log("ngInit", this.receivedData);
    if (Object.keys(this.receivedData as object).length === 0) {
      this.router.navigate(['/core/waiter/orders']);
    }
    console.log("ngInit", this.receivedData);
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
        tempPrice = (this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients)?.modification_price!);
        break;
      case eDishModificationType.remove:
        if (this.tempDishes[index].ingredients?.includes(tempName)) {
          tempPrice = - (this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients)?.modification_price!);
        } else {
          this.notifier.showError(400, "Ingredient not present in the dish")
          return;
        }
        break;
      case eDishModificationType.more:
        if (!this.tempDishes[index].ingredients?.includes(tempName)) {
          let tempIngredient = this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients);
          tempPrice = (tempIngredient?.modification_percentage! * tempIngredient?.modification_price!) / 100;
        } else {
          this.notifier.showError(400, "Ingredient already present in the dish")
          return;
        }
        break;
      case eDishModificationType.less:
        if (this.tempDishes[index].ingredients?.includes(tempName)) {
          let tempIngredient = this.ingredientReference?.find((ingredient) => ingredient._id === this.tempDishes[index].formIngredients?.value.ingredients);
          tempPrice = - (tempIngredient?.modification_percentage! * tempIngredient?.modification_price!) / 100;
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

    //TODO: change price of the dish according to the modification
    this.tempDishes[index].actual_price = parseFloat((this.tempDishes[index].actual_price + tempPrice).toFixed(2));

    this.tempDishes[index].modifications?.push({
      ingredient: this.tempDishes[index].formIngredients?.value.ingredients,
      name: tempName,
      type: this.tempDishes[index].formIngredients?.value.type,
      price_modification: tempPrice,
    });



  }
  removeIngredient(dish: number, element: number) {
    //remove price of the ingredient from the dish
    this.tempDishes[dish].actual_price = parseFloat((this.tempDishes[dish].actual_price - this.tempDishes[dish].modifications![element].price_modification!).toFixed(2));
    this.tempDishes[dish].modifications?.splice(element, 1);
  }

  removeCourse(index: number) {
    this.tempDishes.splice(index, 1);
  }
  sendData() {
    //send data to the pagedata service
    this.receivedData!.courses!.push({
      dishes: this.tempDishes,
    });
    console.log("sendData in MenuSelector", this.receivedData);
    this.pagedata.data = { ... this.receivedData };
    this.router.navigate(['/core/waiter/orders/detail']);
  }
  changeOrderStatus() {
    if (this.receivedData?.order.courses.length === 0) {
      this.api.put("/orders/" + this.pagedata.data.order._id + "/action/" + eOrderStatus.waiting, {}).subscribe({
        next: (response) => {
          //this.notifier.showSuccess(response.status, response.message);
        },
        error: (err) => {
          //console.log(err);
          this.notifier.showError(err.status, err.error.message);
          this.router.navigate(['/core/waiter/orders']);
        }
      });

    }
    else {
      this.api.put("/orders/" + this.pagedata.data.order._id + "/action/" + eOrderStatus.serving, {}).subscribe({
        next: (response) => {
          //this.notifier.showSuccess(response.status, response.message);
        },
        error: (err) => {
          //console.log(err);
          this.notifier.showError(err.status, err.error.message);
          this.router.navigate(['/core/waiter/orders']);
        }
      });
    }
  }
}

