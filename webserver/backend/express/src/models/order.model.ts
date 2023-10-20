import {Schema, model} from 'mongoose';
import { Dish, iDish } from "./dish.model";
import { iUser } from "./user.model";
import { UserAction, iUserAction } from './user_action.object';


export interface iCourse {
    dishes:             iDish['_id'][];
    created_waiter:     iUserAction;
    served_waiter?:     iUserAction;
    //🔮future feature (not implemented)
    deleted_waiter?:    iUserAction;
}

export interface iOrder {
    _id:         Schema.Types.ObjectId;
    courses:     iCourse[];
}


const OrderSchema = new Schema<iOrder>({
    courses:     {type: [{
        dishes:                 {type: [Schema.Types.ObjectId], ref: 'Dish', required: true},
        created_waiter:         {type: UserAction, required: true},
        served_waiter:          {type: UserAction, required: false},
        //🔮future feature (not implemented)
        deleted_waiter:         {type: UserAction, required: false}
    }],required: true}
},{
    versionKey: false,
    collection: 'Orders'
});

export const Order = model<iOrder>('Order', OrderSchema);
