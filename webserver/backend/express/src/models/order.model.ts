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
export interface iLogCourse {
    created_course: iUserAction;
    served_course?: iUserAction;
    ready_course?: iUserAction;
    //🔮future feature (not implemented)
    deleted_course?: iUserAction;
}
export interface iLogOrder {
    created_order: iUserAction;
    //not used
    //taken_order?: iUserAction;
}

export interface iCourse {
    _id: Schema.Types.ObjectId;
    dishes: iDish['_id'][];
    logs_course?: iLogCourse;
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


    final_price?: number;
}


const OrderSchema = new Schema<iOrder>({
    guests: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: { type: eOrderStatus, required: false, enum: eOrderStatus, default: eOrderStatus.waiting },
    room: { type: Schema.Types.ObjectId, required: true, ref: 'Room', unique: false},
    tables: { type: [Schema.Types.ObjectId], required: true, ref: 'Table'},
    logs_order: {
        created_order: { type: UserAction, required: true },
        //taken_order: { type: UserAction, required: false },
    },
    courses: {
        type: [{
            dishes: { type: [Schema.Types.ObjectId], ref: 'Dish', required: true },
            logs_course: {
                created_course: { type: UserAction, required: true },
                ready_course: { type: UserAction, required: false },
                served_course: { type: UserAction, required: false },
                deleted_course: { type: UserAction, required: false },
                required: false
            }
        }], required: false
    },
    final_price: { type: Number, required: false }
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

export function verifyPartialOrderData(order: Partial<iOrder>): boolean {
    if (order.guests && order.guests < 0) return false;
    if (order.capacity && order.capacity < 0) return false;

    if (order.tables && order.tables.length === 0) return false;

    if (order.status && !Object.values(eOrderStatus).includes(order.status)) return false;

    if (order.courses && order.courses.length != 0) {
        for (const course of order.courses) {
            if (!course.dishes || course.dishes.length === 0) return false;
        }
    }
    return true;
}

export const Order = model<iOrder>('Order', OrderSchema);
