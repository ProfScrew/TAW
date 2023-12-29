import {Schema, model} from 'mongoose';

export interface iRestaurantInformation {
    _id: Schema.Types.ObjectId;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string; 
    iva: string;
    charge_per_person: number;
}

export const RestaurantInformationSchema = new Schema<iRestaurantInformation>({
    name: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    logo: {type: String, required: false},
    iva: {type: String, required: true},
    charge_per_person: {type: Number, required: true},
},{
    versionKey: false,
    collection: 'RestaurantInformations'
});

export function verifyResturantInformationData(restaurant_information: iRestaurantInformation): boolean {
    if(!restaurant_information.name) return false;
    if(!restaurant_information.address) return false;
    if(restaurant_information.phone===undefined) return false;
    if(!restaurant_information.email) return false;
    if(!restaurant_information.logo) return false;
    if(!restaurant_information.iva) return false;
    
    return true;
}

export const RestaurantInformation = model<iRestaurantInformation>('RestaurantInformation', RestaurantInformationSchema);