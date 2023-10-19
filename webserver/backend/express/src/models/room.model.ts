import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';

export interface iRoom{
    _id: Schema.Types.ObjectId;
    name: string;
}

export const RoomSchema = new Schema<iRoom>({
    name: {type: String, required: true},
},{
    versionKey: false,
    collection: 'Rooms'
});

export const Room = model<iRoom>('Room', RoomSchema);