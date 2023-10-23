import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';

export interface iRestaurantInformation {
    _id: Schema.Types.ObjectId;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string; //TODO: reverse proxy static folder 
    iva: string;
}

export const RestaurantInformationSchema = new Schema<iRestaurantInformation>({
    name: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    logo: {type: String, required: false},
    iva: {type: String, required: true},
},{
    versionKey: false,
    collection: 'RestaurantInformations'
});

export const RestaurantInformation = model<iRestaurantInformation>('RestaurantInformation', RestaurantInformationSchema);