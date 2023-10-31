import { Schema, model } from 'mongoose';
import { Dish, iDish } from "./dish.model";
import { iUser } from "./user.model";
import { UserAction, iUserAction } from './user_action.object';
import { iRoom } from './room.model';
import { iTable } from './table.model';

export enum eOrderStatus {
    waiting = 'waiting',
    ordering = 'ordering',
    serving = 'serving',
    delivered = 'delivered',
}
export interface iLogOrder {
    created_order: iUserAction;
    taken_order?: iUserAction;
}

export interface iCourse {
    dishes: iDish['_id'][];
    created_waiter: iUserAction;
    served_waiter?: iUserAction;
    //🔮future feature (not implemented)
    deleted_waiter?: iUserAction;
}
export interface iOrder {
    _id: Schema.Types.ObjectId;
    guests: number;
    capacity: number;

    status?: eOrderStatus;
    room: iRoom['_id'];
    tables: iTable['_id'][];

    logs_order?: iLogOrder;
    courses: iCourse[];
}


const OrderSchema = new Schema<iOrder>({
    guests: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: { type: eOrderStatus, required: false, enum: eOrderStatus, default: eOrderStatus.waiting },
    room: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
    tables: { type: [Schema.Types.ObjectId], required: true, ref: 'Table' },
    logs_order: {
        created_order: { type: UserAction, required: true },
        taken_order: { type: UserAction, required: false },
    },
    courses: {
        type: [{
            dishes: { type: [Schema.Types.ObjectId], ref: 'Dish', unique: true, required: true },
            created_waiter: { type: UserAction, required: false },
            served_waiter: { type: UserAction, required: false },
            //🔮future feature (not implemented)
            deleted_waiter: { type: UserAction, required: false }
        }], required: false
    }
}, {
    versionKey: false,
    collection: 'Orders'
});

export function verifyOrderData(order: iOrder): boolean {
    if (!order.guests || order.guests < 0) return false;
    if (!order.capacity || order.capacity < 0) return false;
    if (!order.room) return false;
    if (!order.tables || order.tables.length === 0) return false;
    if (order.status && !Object.values(eOrderStatus).includes(order.status)) return false;

    if (order.courses && order.courses.length != 0) {
        for (const course of order.courses) {
            if (!course.dishes || course.dishes.length === 0) return false;
        }
    }
    return true;
}

export const Order = model<iOrder>('Order', OrderSchema);
