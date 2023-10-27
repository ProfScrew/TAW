import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';

export interface iCategory {
    _id: Schema.Types.ObjectId;
    name: string;
    color: string;
    order?: number;
}

export const CategorySchema = new Schema<iCategory>({
    name:  {type: String, required: true},
    color: {type: String, required: true},
    order: {type: Number, required: false, unique: true},
},{
    versionKey: false,
    collection: 'Categories'
});

export function verifyFormData(cat: iCategory): boolean {
    if(!cat.name || cat.name === '') return false;
    if(!cat.color || cat.color === '') return false;
    //if(cat.order === undefined) return false;
    return true;
}



export const Category = model<iCategory>('Category', CategorySchema);