import { iUserAction } from "./user_action.object";

export interface iIngredient {
    _id:                    string;
    name:                   string;
    alergens:               string[];
    modification_price:     number;
    modification_percentage:number;

    deleted?:       iUserAction;
}