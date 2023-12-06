import { FormGroup } from "@angular/forms";
import { eDishModificationType, eDishStatus } from "src/app/core/models/dish.model";
import { iIngredient } from "src/app/core/models/ingredient.model";
import { eOrderStatus, iOrder } from "src/app/core/models/order.model";
import { iRecipe } from "src/app/core/models/recipe.model";
import { iRoom } from "src/app/core/models/room.model";
import { iTable } from "src/app/core/models/table.model";

export interface iOrderData {
    room: string;
    tables: string;
    guests: string;
    status: eOrderStatus;
}

//----------------------------------------------
// Section: used in creating new courses for an order
export interface iTempDishModification {
    ingredient: iIngredient['_id'];
    name:       string;
    type:       eDishModificationType;
    price_modification?:       number;
}
export interface iTempDish {

    //temporary data used in frontend
    name?: string; //recipe.name
    description?: string; //recipe.description
    ingredients?: string[]; //recipe.ingredients

    //temporary forms used to insert data (notes) and add dish modifications
    formNotes?: FormGroup;
    formIngredients?: FormGroup;

    //-------------------------


    recipe: iRecipe['_id'];
    actual_price: number; //calculate in fromtend (recipe.price + if(modification) {ingredients.price} )
    notes?: string;
    status?: eDishStatus; //default: waiting by waiter
    modifications?: iTempDishModification[];

}
export interface iTempCourse {
    dishes: iTempDish[];
}
//----------------------------------------------


export interface iTempOrder {
    order: iOrder;
    courses?: iTempCourse[];
}


