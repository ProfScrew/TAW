import { Schema, model } from 'mongoose';
import { randomBytes, createHmac } from 'crypto'
import { iRoom } from './room.model';
import { iCategory } from './category.model';
import { HASH_METHOD } from '../configs/app.config';

// @ts-ignore
import { isNumeric } from 'validator';

export interface iRole {
    admin: boolean;
    waiter: boolean;
    production: boolean;
    cashier: boolean;
    analytics: boolean;
}

export interface iUser {
    username: string;
    name: string;
    surname: string;
    phone: string;
    password_hash: string;
    password_salt: string;

    role: iRole;
    category?: iCategory['_id'][];
    room?: iRoom['_id'][];

    setPassword: (password: string) => void;
    checkPassword: (password: string) => boolean;
}


export const UserSchema = new Schema<iUser>({
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password_hash: { type: String, required: true },
    password_salt: { type: String, required: true },
    role: {
        admin: { type: Boolean, required: true, default: false },
        waiter: { type: Boolean, required: true, default: false },
        production: { type: Boolean, required: true, default: false },
        cashier: { type: Boolean, required: true, default: false },
        analytics: { type: Boolean, required: true, default: false },
    },
    category: [{ type: Schema.Types.ObjectId, required: false, ref: 'Category' }],
    room: [{ type: Schema.Types.ObjectId, required: false, ref: 'Room' }],
}, {
    versionKey: false,
    collection: 'Users'
});


UserSchema.methods.setPassword = function (password: string) {
    this.password_salt = randomBytes(16).toString('hex');

    const hash = createHmac(HASH_METHOD, this.password_salt);
    hash.update(password);

    this.password_hash = hash.digest('hex');
}

UserSchema.methods.checkPassword = function (password: string) {
    const hash = createHmac(HASH_METHOD, this.password_salt);
    hash.update(password);

    return (this.password_hash === hash.digest('hex'));
}

export const User = model<iUser>('User', UserSchema);

//-----------------------------------------------------------------------
//utility for user route

export interface iUserForm {
    username: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
    category?: iCategory['_id'][];
    room?: iRoom['_id'][];
    role: {
        admin: boolean;
        waiter: boolean;
        production: boolean;
        cashier: boolean;
        analytics: boolean;
    }
}

export function verifyUserData(user: iUserForm | Partial<iUserForm>, update: boolean): boolean {
    if (typeof user !== 'object' || user === null) return false;

    if (!update) {//new user
        if (typeof user.username !== 'string') return false;
        if (typeof user.phone !== 'string') return false;
        if (isNumeric(user.phone) === false) return false;
        if (typeof user.name !== 'string') return false;
        if (typeof user.surname !== 'string') return false;
        if (typeof user.password !== 'string') return false;
    }else{//update user
        if(!(user.phone === undefined || (typeof user.phone === 'string' && isNumeric(user.phone) ===true))) return false;
        if(!(user.name === undefined || typeof user.name === 'string')) return false;
        if(!(user.surname === undefined || typeof user.surname === 'string')) return false;
        if(!(user.password === undefined || typeof user.password === 'string')) return false;
    }
    return true;
}