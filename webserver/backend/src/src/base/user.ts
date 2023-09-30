import { Schema, model } from 'mongoose';
import { randomBytes, createHmac } from 'crypto'

const HASH_METHOD = 'sha512';

export interface iUser {
    username: string;
    name: string;
    surname: string;
    phone: string;
    
    password_hash: string;
    password_salt: string;

    role: string;

    set_password:   (password: string) => void;
    check_password: (password: string) => boolean;
}


interface iWaiter {
    user:    iUser['username'];
    rooms?:  string[];
    tables?: number[];
    //no table restriction
    hasRoomRestriction:  () => boolean;
    hasTableRestriction: () => boolean;
}

interface iProduction {
    user:   iUser['username'];
    submenus: string[];
}


export const WaiterSchema = new Schema<iWaiter>({
    user:   { type: String,   required: true, unique: true, ref: 'User' },
    rooms:  { type: [String], required: false },
    tables: { type: [Number], required: false },
},{
    versionKey: false,collection: 'Waiter'});

export const ProductionSchema = new Schema<iProduction>({
    user:     { type: String,   required: true, unique: true, ref: 'User' },
    submenus: { type: [String], required: true },
},{
    versionKey: false,collection: 'Production'});

export const UserSchema = new Schema<iUser>({
    username:         { type: String, required: true, unique: true },
    phone:         { type: String, required: true, unique: true },
    name:          { type: String, required: true },
    surname:       { type: String, required: true },
    password_hash: { type: String, required: true },
    password_salt: { type: String, required: true },
    role:          { type: String, required: false },
},{
    versionKey: false,
    collection: 'User'
});


UserSchema.methods.set_password = function(password: string) {
    this.password_salt = randomBytes(16).toString('hex');
    
    const hash = createHmac(HASH_METHOD, this.password_salt);
    hash.update(password);

    this.password_hash = hash.digest('hex');
}

UserSchema.methods.check_password = function(password: string) {
    const hash = createHmac(HASH_METHOD, this.password_salt);
    hash.update(password);

    return (this.password_hash === hash.digest('hex'));
}

WaiterSchema.methods.hasRoomRestriction = function() {
    return (this.rooms && this.rooms.length > 0);
}

WaiterSchema.methods.hasTableRestriction = function() {
    return (this.tables && this.tables.length > 0);
}

export const User       = model<iUser>('User', UserSchema);
export const Waiter     = model<iWaiter>('Waiter', WaiterSchema);
export const Production = model<iProduction>('Production', ProductionSchema);
