import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iUserAction, UserAction } from './typedef';

export interface restaurant_information {
    _id: Schema.Types.ObjectId;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
    iva: number;
}