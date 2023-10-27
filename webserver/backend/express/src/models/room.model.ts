import {Schema, model, Types} from 'mongoose';
import mongoose from 'mongoose';

export interface iRoom{
    _id: Schema.Types.ObjectId;
    name: string;
}

export const RoomSchema = new Schema<iRoom>({
    name: {type: String, required: true, unique: true},
},{
    versionKey: false,
    collection: 'Rooms'
});

// 📝 Review this function, different name or review concept
export function verifyRoomData(room: iRoom): boolean {
    if (!room.name || room.name === '') return false;
    return true;
}

export const Room = model<iRoom>('Room', RoomSchema);