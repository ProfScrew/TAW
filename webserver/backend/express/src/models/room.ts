import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './typedef';

export interface iRoom{
    _id: Schema.Types.ObjectId;
    name: string;
}