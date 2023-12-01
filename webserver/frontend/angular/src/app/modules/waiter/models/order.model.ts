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
    type:       eDishModificationType;
}
export interface iTempDish {
    recipe: iRecipe['_id'];
    actual_price: number; //calculate in fromtend (recipe.price + if(modification) {ingredients.price} )
    notes?: string;
    status: eDishStatus; //default: waiting by waiter
    modifications?: iTempDishModification[];

}
export interface iTempCourse {
    dishes: iTempDish[];
}
//----------------------------------------------


export interface iOrderPlusReferences {
    order: iOrder;
    roomReference: iRoom[];
    tableReference: iTable[];
    courses?: iTempCourse[];
}


