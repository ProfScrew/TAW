import { iCategory } from './category.model';
import { iRoom } from './room.model';

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
    password?: string;
    password_hash?: string;
    password_salt?: string;

    role: iRole;
    category?: iCategory['_id'][];
    room?: iRoom['_id'][];

}