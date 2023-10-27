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
    name:        { type:  String, required: true, unique: true },
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
    console.log(recipe);
    if (!recipe.name || recipe.name === '') return false;
    if (!recipe.ingredients || recipe.ingredients.length === 0) return false;
    if (!recipe.base_price || recipe.base_price < 0) return false;
    if (!recipe.category) return false;

    return true;
}


export const Recipe = model<iRecipe>('Recipe', RecipeSchema);


//📝review this function
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
//📝review this function
RecipeSchema.methods.deleteArchive = async function(action: iUserAction): Promise<void> {
    const recipe = this;

    // Check if the recipe is already deleted
    if (recipe.deleted) {
        throw new Error('Recipe already deleted');
    }

    this.deleted = action;

    await Recipe.updateOne({_id: recipe._id}, recipe).maxTimeMS(1000).orFail();
}

