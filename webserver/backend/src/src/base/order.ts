import {Schema, model} from 'mongoose';
import { Dish, iDish } from "./dish";
import { iUser } from "./user";
import { UserAction, iUserAction } from '../common/typedef';


export interface iCourse {///NEED TO ADD TIME OF CREATION OF EITHER ORDER IF FIRST COURSE OR ADD IT LATER WHEN THE COURSE ABOVE IS SERVED
    dishes:     iDish['_id'][];
    // created_by: iUser['username'];
    // created_at: Date;P
    created: iUserAction;
}

export interface iOrder {
    _id:         Schema.Types.ObjectId;
    courses:     iCourse[];
    waiter?:     iUser['username']; //<-- delete
    created:     iUserAction;//<-- delete

    delete:      (action: iUserAction) => Promise<iHistoricalOrder>;
}

export interface iHistoricalOrder extends iOrder {
    deleted?:          iUserAction;
    completed?:        iUserAction;
}

const OrderSchema = new Schema<iOrder>({
    created:     {type: UserAction, required: true},
    waiter:      {type: String, ref: 'User', required: false},
    courses:     {type: [{
        dishes:     {type: [{type: String, ref: 'Dish'}], required: true},
        created:    {type: UserAction, required: true},
    }]}
},{
    versionKey: false,collection: 'Order'});

const HistoricalOrderSchema = new Schema<iHistoricalOrder>({
    ...OrderSchema.obj,
    deleted:   {type: UserAction, required: false},
    completed: {type: UserAction, required: false},
},{
    versionKey: false,collection: "HistoricalOrder"});



export const Order = model<iOrder>('Order', OrderSchema);
const HistoricalOrder = model<iHistoricalOrder>('HistoricalOrder', HistoricalOrderSchema); 


OrderSchema.methods.delete = async function(action: iUserAction): Promise<iHistoricalOrder> {
    const order   = this.toObject();   
    const courses = [];
    
    for (const course of order.courses) {
        const dishes = await Dish.find({ _id: { $in: course.dishes } }).maxTimeMS(1000).orFail();
        const ids = []
        
        for (const dish of dishes) 
            ids.push((await dish.archive(action))._id);
    
        courses.push({ dishes: ids, created: course.created, deleted: action });
    }

    delete order._id;
    const historicalOrder = new HistoricalOrder({ ...order, courses, deleted: action });

    await Order.deleteOne({ _id: this._id }).maxTimeMS(1000).orFail();
    await historicalOrder.save();

    return historicalOrder;
}