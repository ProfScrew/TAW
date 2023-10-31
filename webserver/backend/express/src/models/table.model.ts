import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';
import { iRoom } from './room.model';

export enum eTableStatus {
    free = 'free',
    busy = 'busy',
    /* future feature (not implemented)
    reserved = 'reserved',
    unavailable = 'unavailable',
    */
}

export interface iTable {
    _id:        Schema.Types.ObjectId;
    name:       string;
    capacity:   number;
    room:       iRoom['_id'];

    status?:    eTableStatus;
}

export const TableSchema = new Schema<iTable>({
    name:       {type: String, required: true, unique: true},
    capacity:   {type: Number, required: true},
    room:       {type: Schema.Types.ObjectId, required: true, ref: 'Room'},
    status:     {type: eTableStatus, required: false, enum: eTableStatus, default: eTableStatus.free},
},{
    versionKey: false,
    collection: 'Tables'
});

export function verifyTableData(table: iTable): boolean {
    if(! table.name||  table.name==='') return false;
    console.log( table.capacity)
    if( table.capacity===undefined ||  table.capacity < 0) return false;
    if(! table.room) return false;
    
    if(table.status && !Object.values(eTableStatus).includes(table.status)) return false;

    return true;
}

export const Table = model<iTable>('Table', TableSchema);

