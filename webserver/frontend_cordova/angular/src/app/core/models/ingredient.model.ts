import { iUserAction } from "./user_action.object";

export interface iIngredient {
    _id:                    String;
    name:                   string;
    alergens:               string[];
    modification_price:     number;
    modification_percentage:number;

    deleted?:       iUserAction;
}