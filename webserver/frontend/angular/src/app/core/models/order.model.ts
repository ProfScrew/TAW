import { iDish } from './dish.model';
import { iRoom } from './room.model';
import { iTable } from './table.model';
import { iUserAction } from './user_action.object';

export enum eOrderStatus {
    waiting = 'waiting',
    ordering = 'ordering',
    serving = 'serving',
    delivered = 'delivered',
}
export interface iLogCourse {
    created_course: iUserAction;
    served_course?: iUserAction;
    //🔮future feature (not implemented)
    deleted_course?: iUserAction;
}
export interface iLogOrder {
    created_order: iUserAction;
    //not used
    //taken_order?: iUserAction;
}

export interface iCourse {
    _id?: String;
    dishes: iDish['_id'][];
    logs_course?: iLogCourse;
}
export interface iOrder {
    _id: String;
    guests: number;
    capacity: number;

    status?: eOrderStatus;
    room: iRoom['_id'];
    tables: iTable['_id'][];

    logs_order?: iLogOrder;
    courses: iCourse[];


    final_price?: number;
}
