import {Schema, model} from 'mongoose';
import { UserAction, iUserAction } from './user_action.object';
import { iPhysicalTable } from './physical_table.model';
import { iRoom } from './room.model';
import { iOrder } from './order.model';

//https://mongoosejs.com/docs/typescript.html
/*
stats reported above.
if the table is occupied, the waiter can set the status to ordering,
the waiter is saved in the virual table, and only that waiter can modify the order.

after orderd is completed the table goes to waiting,
when waiter is serving the table a single course that course is marked as served,
when all courses are served the table goes to occupied again.

the waiter can set the status to closing, and the table is closed.
Or waiter can add onether course, and the table goes to ordering again.

if table closed, we wait for confirmation from the cashier, and then the table is set to unset.
*/

export enum eVirtualTableStatus {
    free,
    waiting,
    ordering,
    serving,
    delivered,
    closed,
}

export interface iVirtualTable {
    _id:             Schema.Types.ObjectId;
    physical_tables: iPhysicalTable['name'][];
    room:            iRoom['_id'];
    guests?:         number;
    capacity:        number;
    status:          eVirtualTableStatus;
    order?:          iOrder['_id'][];
}
const VirtualTableSchema = new Schema<iVirtualTable>({
    //👀 check how the unique property works
    physical_tables: [{type: String, ref: 'PhysicalTable', required: true, unique: true}],
    room:            {type: Schema.Types.ObjectId, ref: 'Room', required: true},
    guests:          {type: Number, required: false},
    capacity:        {type: Number, required: true},
    status:          {type: String, enum: eVirtualTableStatus, required: true, default: eVirtualTableStatus.free},
    order:           [{type: Schema.Types.ObjectId, ref: 'Order', required: false}],
},{
    versionKey: false,
    collection: 'VirtualTables'
});

export const Table = model<iVirtualTable>('VirtualTable', VirtualTableSchema);

