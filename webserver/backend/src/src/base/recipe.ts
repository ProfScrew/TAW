import { Schema, model } from "mongoose";
import { iIngredient } from "./ingredient";
import { iUserAction, UserAction } from "../common/typedef";


export interface iSubMenu {//rename to category
    name: string;
    color?: string;
}

export interface iRecipe {
    _id:       Schema.Types.ObjectId;
    name:       string;
    ingredients:iIngredient['_id'][];
    base_price: number;
    submenu:    iSubMenu;
    deleted?:   iUserAction;
    //add description field

    deleteArchive:     (action: iUserAction) => Promise<void>;
    updateArchive:     (data: Partial<iRecipe>, action: iUserAction) => Promise<void>;
}

const RecipeSchema = new Schema<iRecipe>({
    name:        { type:  String, required: true },
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    base_price:  { type:  Number, required: true },
    deleted:     { type:  UserAction, required: false },
    submenu: {
        name:  { type: String, required: true  },
        color: { type: String, required: false }
    }
},{
    versionKey: false,collection: 'Recipe' });

export const Recipe = model<iRecipe>('Recipe', RecipeSchema);


RecipeSchema.methods.updateArchive = async function(data: Partial<iRecipe>, action: iUserAction): Promise<void> {
    if (this.deleted) {
        throw new Error('Recipe already deleted');
    }

    // Creates the updated object
    const updated = {...this, ...data};

    // Deletes the old object
    await this.deleteArchive(action);

    // Removes the _id field
    delete updated._id;

    // Creates the new object, without the _id field
    await Recipe.create(updated);
}

RecipeSchema.methods.deleteArchive = async function(action: iUserAction): Promise<void> {
    const recipe = this;

    // Check if the recipe is already deleted
    if (recipe.deleted) {
        throw new Error('Recipe already deleted');
    }

    this.deleted = action;

    await Recipe.updateOne({_id: recipe._id}, recipe).maxTimeMS(1000).orFail();
}

