import {Schema, model} from 'mongoose';
import { UserAction, iUserAction } from './typedef';

//https://mongoosejs.com/docs/typescript.html

export enum TableStatus {
    UNSET    = 'unset', //at the begining?
    //LOCKED   = 'locked', //?
    //RESERVED = 'reserved', //prenotation
    OCCUPIED = 'occupied', //person sitting
    ORDERING = 'ordering', //person ordering
    WAITING  = 'waiting', //person waiting for the order
    CLOSING  = 'closing' //closed order
}

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


export interface iPhysicalTable {
    _id:      Schema.Types.ObjectId;
    name?:    string;
    capacity: number;
    room:     string;
    deleted?: iUserAction;

    delete:   (action: iUserAction) => Promise<void>;
    update:   (data: Partial<iPhysicalTable>, action: iUserAction) => Promise<void>;
}

export interface iTable {
    _id:             Schema.Types.ObjectId;
    name?:           string;
    status:          TableStatus;
    physical_tables: Schema.Types.ObjectId[];
    guests:          number;
    capacity:        number;
    room:            string;
    order?:          Schema.Types.ObjectId;
    //add a field for the waiter that is taking the order
    //order_user:      String;
}

export interface iHistoricalTable extends iTable {
    deleted?:          iUserAction;
    completed?:        iUserAction;
}

const PhysicalTableSchema = new Schema<iPhysicalTable>({
    name:     { type: String,     required: true, unique: true },
    deleted:  { type: UserAction, required: false },    
    capacity: { type: Number,     required: true },
    room:     { type: String,     required: true }
},{
    versionKey: false,
    collection: 'PhysicalTable'
});

const TableSchema = new Schema<iTable>({
    name:            {type: String, required: false},
    status:          {type: String, required: true},
    physical_tables: [{type: Schema.Types.ObjectId, ref: 'PhysicalTable', required: true, unique: true}],
    guests:          {type: Number, required: true},
    capacity:        {type: Number, required: true},
    order:           {type: Schema.Types.ObjectId, ref: 'Order', required: false},

},{
    versionKey: false,
    collection: 'Table'
});

const HistoricalTableSchema = new Schema<iHistoricalTable>({
    ...TableSchema.obj,
    deleted:   {type: UserAction, required: false},
    completed: {type: UserAction, required: false},
},{
    versionKey: false,collection: "HistoricalTable"});


export const PhysicalTable = model<iPhysicalTable>('PhysicalTable', PhysicalTableSchema);
export const Table         = model<iTable>('Table', TableSchema);
const HistoricalTable = model<iHistoricalTable>('HistoricalTable', HistoricalTableSchema); 


PhysicalTableSchema.methods.update = async function(data: Partial<iPhysicalTable>, action: iUserAction): Promise<void> {
    if (this.deleted) {
        throw new Error('PhysicalTable already deleted');
    }

    // Creates the updated object
    const updated = {...this, ...data};

    // Deletes the old object
    await this.delete(action);

    // Removes the _id field
    delete updated._id;

    // Creates the new object, without the _id field
    await PhysicalTable.create(updated);
}

PhysicalTableSchema.methods.delete = async function(action: iUserAction): Promise<void> {
    const physical_table = this;

    // Check if the physical_table is already deleted
    if (physical_table.deleted) {
        throw new Error('PhysicalTable already deleted');
    }

    this.deleted = action;

    await PhysicalTable.updateOne({_id: physical_table._id}, physical_table).maxTimeMS(1000).orFail();
}

// TableSchema.methods.delete = async function(action: iUserAction): Promise<iHistoricalTable> {
    
// }