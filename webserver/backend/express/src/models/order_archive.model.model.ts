import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';
import { iRecipe } from './recipe.model';
import { iIngredient } from './ingredient.model';
import { eDishModificationType } from './dish.model';


export interface iDishModificationArchive{
    ingredient: iIngredient['_id'];
    type: eDishModificationType;
}

export interface iDishArchive {
    recipe:             iRecipe['_id'];
    actual_price:       number;
    notes?:             string;
    logs_status?:       {start_cooking: iUserAction, finish_cooking: iUserAction};
    modifications?:     iDishModificationArchive[];

}

export interface iCourseArchive {
    created_waiter:     iUserAction;
    served_waiter:     iUserAction;
    deleted_waiter?:    iUserAction;
    dishes:            iDishArchive[];
}


export interface iOrderArchive {
    _id:            Schema.Types.ObjectId;
    guests:         number;
    capacity:       number;
    physical_table: String[];

    courses:        iCourseArchive[];
}

const OrderArchiveSchema = new Schema<iOrderArchive>({
    guests:         {type: Number, required: true},
    capacity:       {type: Number, required: true},
    physical_table: {type: [String], required: true},
    courses:        {type: [{
        created_waiter: {type: UserAction, required: true},
        served_waiter:  {type: UserAction, required: true},
        deleted_waiter: {type: UserAction, required: false},
        dishes:         {type: [{
            recipe:             {type: Schema.Types.ObjectId, ref: 'Recipe', required: true},
            actual_price:       {type: Number, required: true},
            notes:              {type: String, required: false},
            logs_status:        {
                start_cooking: {type: UserAction, required: true},
                finish_cooking: {type: UserAction, required: true},
                required: true,
            },
            modifications:  {type: [{
                ingredient: {type: Number, ref: "Ingredient", required: true},
                type:       {type: String, enum: eDishModificationType, required: true},
            }], required: false},
        }], required: true},
    }], required: true},
},{
    versionKey: false,
    collection: 'OrderArchives'
});

export const OrderArchive = model<iOrderArchive>('OrderArchive', OrderArchiveSchema);