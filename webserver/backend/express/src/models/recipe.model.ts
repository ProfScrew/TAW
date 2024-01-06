import { Schema, model } from "mongoose";
import { iIngredient } from "./ingredient.model";
import { iUserAction, UserAction } from "./user_action.object";
import { iCategory } from "./category.model";



export interface iRecipe {
    _id:            Schema.Types.ObjectId;
    name:           string;
    description?:   string;
    ingredients:    iIngredient['_id'][];
    base_price:     number;
    category?:       iCategory['_id'];
    deleted?:       iUserAction;

    deleteArchive:     (action: iUserAction) => Promise<void>;
    updateArchive:     (data: Partial<iRecipe>, action: iUserAction) => Promise<void>;
}

const RecipeSchema = new Schema<iRecipe>({
    name:        { type:  String, required: true, unique: false },
    description: { type:  String, required: false },
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    base_price:  { type:  Number, required: true },
    category:    { type:  Schema.Types.ObjectId, required: true, ref: 'Category' },
    deleted:     { type:  UserAction, required: false }
},{
    versionKey: false,
    collection: 'Recipes'
});

export function verifyRecipeData(recipe: iRecipe): boolean {
    //console.log(recipe);
    if (!recipe.name || recipe.name === '') return false;
    if (!recipe.ingredients || recipe.ingredients.length === 0) return false;
    if (!recipe.base_price || recipe.base_price < 0) return false;
    if (!recipe.category) return false;

    return true;
}


export const Recipe = model<iRecipe>('Recipe', RecipeSchema);

