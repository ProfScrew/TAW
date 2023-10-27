import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iRoom } from './room.model';


export interface iPhysicalTable {
    _id:        Schema.Types.ObjectId;
    name:       string;
    capacity:   number;
    room:       iRoom['_id'];
}
export const PhysicalTableSchema = new Schema<iPhysicalTable>({
    name:       {type: String, required: true, unique: true},
    capacity:   {type: Number, required: true},
    room:       {type: Schema.Types.ObjectId, required: true, ref: 'Room'},
},{
    versionKey: false,
    collection: 'PhysicalTables'
});

export function verifyPhisicalTableData(physical_table: iPhysicalTable): boolean {
    if(!physical_table.name|| physical_table.name==='') return false;
    console.log(physical_table.capacity)
    if(physical_table.capacity===undefined || physical_table.capacity < 0) return false;
    if(!physical_table.room) return false;

    return true;
}

export const PhysicalTable = model<iPhysicalTable>('PhysicalTable', PhysicalTableSchema);

