import { iUserAction } from "./user_action.object";
import { iCategory } from "./category.model";
import { iIngredient } from "./ingredient.model";

export interface iRecipe {
    _id:            string;
    name:           string;
    description?:   string;
    ingredients:    iIngredient['_id'][];
    base_price:     number;
    category?:       iCategory['_id'];
    deleted?:       iUserAction;

    
}