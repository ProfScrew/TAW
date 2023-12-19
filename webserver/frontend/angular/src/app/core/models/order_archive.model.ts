import { eDishModificationType } from "./dish.model";
import { iIngredient } from "./ingredient.model";
import { iLogCourse, iLogOrder } from "./order.model";
import { iRecipe } from "./recipe.model";
import { iUserAction } from "./user_action.object";


export interface iDishModificationArchive{
    ingredient: iIngredient['_id'];
    type:       eDishModificationType;
    price:      number;

    //for display only
    ingredient_obj?: iIngredient;
}

export interface iDishArchive {
    recipe:             iRecipe['_id'];
    actual_price:       number;
    notes?:             string;
    logs_status?:       {start_cooking: iUserAction, finish_cooking: iUserAction};
    modifications?:     iDishModificationArchive[];

    //for display only
    recipe_obj?:        iRecipe;

}

export interface iCourseArchive {
    logs_course:       iLogCourse;
    dishes:            iDishArchive[];

}


export interface iOrderArchive {
    _id:                string;
    guests:             number;
    capacity:           number;
    tables:             string[];

    logs_order:         iLogOrder;

    charges_persons:    number;
    final_price:        number;


    courses:        iCourseArchive[];
}