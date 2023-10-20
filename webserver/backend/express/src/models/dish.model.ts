import { Schema, model } from 'mongoose';
import { iRecipe } from './recipe.model';
import { iUser } from './user.model';
import { iIngredient } from './ingredient.model';
import { UserAction, iUserAction } from './user_action.object';

export enum eDishStatus {
    waiting,
    working,
    ready,
};

export enum eDishModificationType {
    add,
    remove,
    more,
    less,
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
    status:             {type: String, required: true, enum: eDishStatus, default: 'waiting'},
    logs_status:        {
        start_cooking: {type: UserAction, required: false},
        finish_cooking: {type: UserAction, required: false},
        required: false,
    },
    
    modifications:  {type: [{
        ingredient: {type: Number, ref: "Ingredient", required: true},
        type:       {type: String, enum: eDishModificationType, required: true},
    }], required: false},
},{
    versionKey: false,
    collection: "Dish"
});


export const Dish = model<iDish>('Dish', DishSchema);


