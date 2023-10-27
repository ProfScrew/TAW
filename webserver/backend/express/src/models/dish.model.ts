import { Schema, model } from 'mongoose';
import { iRecipe } from './recipe.model';
import { iUser } from './user.model';
import { iIngredient } from './ingredient.model';
import { UserAction, iUserAction } from './user_action.object';

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
}


export interface iDish {
    _id:                Schema.Types.ObjectId;
    recipe:             iRecipe['_id'];
    actual_price:       number;
    notes?:             string;
    status:             eDishStatus;
    
    logs_status?:        {start_cooking: iUserAction, finish_cooking: iUserAction};

    modifications?:      iDishModification[];
}

const DishSchema = new Schema<iDish>({
    recipe:             {type: Schema.Types.ObjectId, ref: 'Recipe', required: true},
    actual_price:              {type: Number, required: true},
    notes:              {type: String, required: false},
    status:             {type: eDishStatus, required: true, enum: eDishStatus, default: eDishStatus.waiting},
    logs_status:        {
        start_cooking: {type: UserAction, required: false},
        finish_cooking: {type: UserAction, required: false},
        required: false,
    },
    
    modifications:  {type: [{
        ingredient: {type: Number, ref: "Ingredient", required: true},
        type:       {type: eDishModificationType, enum: eDishModificationType, required: true},
    }], required: false},
},{
    versionKey: false,
    collection: "Dish"
});

export function verifyDishData(dish: iDish): boolean {
    if (!dish.recipe) return false;
    if (dish.actual_price === undefined || dish.actual_price < 0) return false;

    // Optionally, you can add more specific validation for other properties (not included):
    // if (dish.notes && dish.notes.length > MAX_NOTES_LENGTH) return false;

    if (!Object.values(eDishStatus).includes(dish.status)) return false;

    if (dish.modifications) {
        for (const modification of dish.modifications) {
            if (!modification.ingredient || !modification.type) {
                return false;
            }
            if (!Object.values(eDishModificationType).includes(modification.type)) {
                return false;
            }
        }
    }

    return true;
}


export const Dish = model<iDish>('Dish', DishSchema);


