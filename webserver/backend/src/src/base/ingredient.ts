import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from '../common/typedef';

export interface iIngredient {
    _id:            Types.ObjectId;
    name:           string;
    alergens:       string[];
    price_per_unit: number;
    unit:           string;
    //delete units
    deleted?:       iUserAction;
    


    deleteArchive:         (action: iUserAction) => Promise<void>;
    updateArchive:         (data: Partial<iIngredient>, action: iUserAction) => Promise<void>;
}




export const IngredientSchema = new Schema<iIngredient>({
    name:           {type: String, required: true},
    alergens:       {type: [String]},
    price_per_unit: {type: Number, required: true},
    unit:           {type: String, required: true},
    deleted:        {type: UserAction, required: false}

},{
    versionKey: false,collection: 'Ingredient' });




export function isIngredient(ing: iIngredient): boolean {

    if (!ing.name || ing.name === '')                  return false;
    if (!ing.price_per_unit || ing.price_per_unit < 0) return false;
    if (!ing.unit || ing.unit === '')                  return false;

    return true;
}



IngredientSchema.methods.updateArchive = async function(data: Partial<iIngredient>, action: iUserAction): Promise<void> {
    if (this.deleted) {
        throw new Error('Ingredient already deleted');
    }
    // Creates the updated object
    const updated = {...this, ...data};
    const newIngredient = new Ingredient({
        ...updated,
        _id: new Types.ObjectId()
    });

    // Deletes the old object
    await this.deleteArchive(action);
    // Creates the new object, without the _id field
    await Ingredient.create(newIngredient).catch((err: mongoose.Error) => {
        throw new Error(err.message, err);
    });
}



IngredientSchema.methods.deleteArchive = async function(action: iUserAction): Promise<void> {
    const ingredient = this;
    // Check if the ingredient is already deleted
    if (ingredient.deleted) {
        throw new Error('Ingredient already deleted');
    }
    // Update the ingredient
    ingredient.deleted = action;
    // Save the ingredient
    await Ingredient.updateOne({_id: ingredient._id}, ingredient).maxTimeMS(1000).orFail();
}

export const Ingredient = model<iIngredient>('Ingredient', IngredientSchema);