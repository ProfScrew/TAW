import { iIngredient } from "./ingredient.model";
import { iRecipe } from "./recipe.model";
import { iUserAction } from "./user_action.object";

export enum eDishStatus {
    waiting = 'waiting',
    working = 'working',
    ready = 'ready',
};

export enum eDishModificationType {
    add = 'add',
    remove = 'remove',
    more = 'more',
    less = 'less',
};

export interface iDishModification {
    ingredient: iIngredient['_id'];
    type:       eDishModificationType;
}


export interface iDish {
    _id:                String;
    recipe:             iRecipe['_id'];
    actual_price:       number;
    notes?:             string;
    status:             eDishStatus;
    
    logs_status?:        {start_cooking: iUserAction, finish_cooking: iUserAction};

    modifications?:      iDishModification[];
}
