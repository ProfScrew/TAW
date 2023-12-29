import {Schema, model} from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';
import { iRecipe } from './recipe.model';
import { iIngredient } from './ingredient.model';
import { eDishModificationType } from './dish.model';
import { iLogCourse, iLogOrder } from './order.model';


export interface iDishModificationArchive{
    ingredient: iIngredient['_id'];
    type:       eDishModificationType;
    price:      number;
}

export interface iDishArchive {
    recipe:             iRecipe['_id'];
    actual_price:       number;
    notes?:             string;
    logs_status?:       {start_cooking: iUserAction, finish_cooking: iUserAction};
    modifications?:     iDishModificationArchive[];

}

export interface iCourseArchive {
    logs_course:       iLogCourse;
    dishes:            iDishArchive[];
}


export interface iOrderArchive {
    _id:                Schema.Types.ObjectId;
    guests:             number;
    capacity:           number;
    tables:             String[];

    logs_order:         iLogOrder;

    charges_persons:    number;
    final_price:        number;


    courses:        iCourseArchive[];
}

const OrderArchiveSchema = new Schema<iOrderArchive>({
    guests:         {type: Number, required: true},
    capacity:       {type: Number, required: true},
    tables:         {type: [String], required: true},
    logs_order:     {
        created_order: {type: UserAction, required: true},
    },
    charges_persons:{type: Number, required: true},
    final_price:    {type: Number, required: true},
    courses:        {type: [{
        logs_course:        {
            created_course: {type: UserAction, required: true},
            served_course:  {type: UserAction, required: false},
            ready_course:   {type: UserAction, required: false},
            deleted_course: {type: UserAction, required: false},
        },
        dishes:         {type: [{
            recipe:             {type: Schema.Types.ObjectId, ref: 'Recipe', required: true},
            actual_price:       {type: Number, required: true},
            notes:              {type: String, required: false},
            logs_status:        {
                start_cooking: {type: UserAction, required: true},
                finish_cooking: {type: UserAction, required: true}, 
            },
            modifications:  {type: [{
                ingredient: {type: Schema.Types.ObjectId, ref: "Ingredient", required: true},
                type:       {type: String, enum: eDishModificationType, required: true},
                price:      {type: Number, required: true},
            }], required: false},
        }], required: true},
    }], required: true},
},{
    versionKey: false,
    collection: 'OrderArchives'
});

export const OrderArchive = model<iOrderArchive>('OrderArchive', OrderArchiveSchema);