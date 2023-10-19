import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './user_action.object';

export interface category {
    _id: Schema.Types.ObjectId;
    name: string;
    color: string;
    order?: number;
}
