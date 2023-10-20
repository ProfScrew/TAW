import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';

export interface iIngredient {
    _id:                    Schema.Types.ObjectId;
    name:                   string;
    alergens:               string[];
    modification_price:     number;
    modification_percentage:number;

    deleted?:       iUserAction;
    
    deleteArchive:          (action: iUserAction) => Promise<void>;
    updateArchive:          (data: Partial<iIngredient>, action: iUserAction) => Promise<void>;
}


export const IngredientSchema = new Schema<iIngredient>({
    name:                       {type: String, required: true},
    alergens:                   {type: [String]},
    modification_price:         {type: Number, required: true},
    modification_percentage:    {type: Number, required: true},
    deleted:                    {type: UserAction, required: false}

},{
    versionKey: false,
    collection: 'Ingredients'
});


//📝review this function, different name or review concept
export function isIngredient(ing: iIngredient): boolean {
    if (!ing.name || ing.name === '')                                   return false;
    if (!ing.modification_price || ing.modification_price < 0)          return false;
    if (!ing.modification_percentage || !ing.modification_percentage)   return false;
    return true;
}


//📝review this function, check details, concept ok
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


//📝review this function, check details, concept ok
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