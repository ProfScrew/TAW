import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './typedef';


export interface physical_table {
    _id:      Schema.Types.ObjectId;
    name?:    string;
    capacity: number;
    room:     string;
}