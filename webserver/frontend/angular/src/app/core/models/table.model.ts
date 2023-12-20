import { iRoom } from "./room.model";

export enum eTableStatus {
    free = 'free',
    busy = 'busy',
    /* future feature (not implemented)
    reserved = 'reserved',
    unavailable = 'unavailable',
    */
}

export interface iTable {
    _id:        string;
    name:       string;
    capacity:   number;
    room:       iRoom['_id'];

    status?:    eTableStatus;

    //used by frontend cashier
    roomName?:  string;
}
