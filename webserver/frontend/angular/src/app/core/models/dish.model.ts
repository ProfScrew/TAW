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

    //for frontend display
    name?:      string;
    price?:     number;
}


export interface iDish {
    _id?:               string;
    recipe:             iRecipe['_id'];
    actual_price:       number;
    notes?:             string;
    status:             eDishStatus;
    
    logs_status?:        {start_cooking: iUserAction, finish_cooking: iUserAction};
    
    modifications?:      iDishModification[];
    
    //for frontend display
    name?:              string;
    category?:          string;
}
