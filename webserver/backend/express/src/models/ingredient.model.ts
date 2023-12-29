import {Schema, model} from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';

export interface iIngredient {
    _id:                    Schema.Types.ObjectId;
    name:                   string;
    alergens:               string[];
    modification_price:     number;
    modification_percentage:number;

    deleted?:       iUserAction;
}

export const IngredientSchema = new Schema<iIngredient>({
    name:                       {type: String, required: true, unique: false},
    alergens:                   {type: [String]},
    modification_price:         {type: Number, required: true},
    modification_percentage:    {type: Number, required: true},
    deleted:                    {type: UserAction, required: false}

},{
    versionKey: false,
    collection: 'Ingredients'
});


export function verifyIngredientData(ing: iIngredient): boolean {
    if (!ing.name || ing.name === '')                                   return false;
    if (!ing.modification_price || ing.modification_price < 0)          return false;
    if (!ing.modification_percentage || ing.modification_percentage < 0 || ing.modification_percentage > 100)   return false;
    return true;
}

export const Ingredient = model<iIngredient>('Ingredient', IngredientSchema);