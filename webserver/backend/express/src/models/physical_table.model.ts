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
    name:       {type: String, required: true},
    capacity:   {type: Number, required: true},
    room:       {type: Schema.Types.ObjectId, required: true, ref: 'Room'},
},{
    versionKey: false,
    collection: 'PhysicalTables'
});

export const PhysicalTable = model<iPhysicalTable>('PhysicalTable', PhysicalTableSchema);

