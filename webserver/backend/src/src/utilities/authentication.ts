import { NextFunction, Request, Response } from "express";
import { BasicStrategy } from "passport-http";
import { debug } from "./debug";
import { User, iUser } from "../models/user";
import jwt from "jsonwebtoken";
import { iRole } from "../models/role";
import { iHttpError } from "./util";

import { JWT_SECRET } from "./config";
import { next_middleware } from "./util"; 


export interface iTokenData {
    name: string,
    surname: string,
    username: string,
    role: iRole
}


export const authenticate = new BasicStrategy(function(username: string, password: string, done: Function) {
    debug('DEBUG: authenticate');

    User.findOne({ username: username }, (err: unknown, user: iUser) => {
        debug('DEBUG: authenticate: findOne');
        if (err) return done({status: 500, error: true, message: err} as iHttpError)
        
        debug('DEBUG: authenticate: findOne: user: ' + user);
        if (!user) return done({status: 404, error: true, message: 'User not found'} as iHttpError);

        debug('DEBUG: authenticate: findOne: check_password');
        if (!user.check_password(password)) return done({status: 401, error: true, message: 'Wrong password'} as iHttpError);

        debug('DEBUG: authenticate: findOne: done');
        return done(null, user);
    });
});

export function authorize(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization!;
    if (!header) { return next_middleware({ status: 401, error: true, message: 'No authorization header provided' }, next); }
    if (!header.startsWith('Bearer ')) return next({ statusCode: 401, error: true, errormessage: 'Invalid authorization header' });

    const token  = header.split(' ')[1];
    if (!token)      { return next_middleware({ status: 401, error: true, message: 'No token provided' }, next); }
    if (!JWT_SECRET) { return next_middleware({ status: 500, error: true, message: 'Internal server error'},next) }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) { return next_middleware({ status: 401, error: true, message: err.message },next); }

        req.user = decoded;
        next();
    });
}

export function create_token(payload: iTokenData, time: string = '168h') {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
}
