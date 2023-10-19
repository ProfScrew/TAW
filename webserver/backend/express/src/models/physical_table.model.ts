import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';


export interface physical_table {
    _id:      Schema.Types.ObjectId;
    name?:    string;
    capacity: number;
    room:     string;
}