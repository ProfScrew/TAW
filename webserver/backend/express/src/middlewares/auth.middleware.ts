import { NextFunction, Request, Response } from "express";
import { BasicStrategy } from "passport-http";
import jwt from "jsonwebtoken";
import { iHttpError } from "./http.middleware";
import { JWT_SECRET, JWT_EXPIRATION } from "../configs/app.config";

import { next_middleware } from "./http.middleware"; 

import { User, iUser, iRole } from "../models/user.model";
import { iCategory } from "../models/category.model";
import { iRoom } from "../models/room.model";
import { expressjwt } from "express-jwt";


export interface iTokenData {
    name: string,
    surname: string,
    username: string,
    role: iRole,
    category?: iCategory["_id"],
    room?: iRoom["_id"],
}


export const authenticate = new BasicStrategy(function(username: string, password: string, done: Function) {

    User.findOne({ username: username }, (err: unknown, user: iUser) => {
        if (err) return done({status: 500, error: true, message: err} as iHttpError)
        if (!user) return done({status: 404, error: true, message: 'User not found'} as iHttpError);
        if (!user.checkPassword(password)) return done({status: 401, error: true, message: 'Wrong password'} as iHttpError);
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

export function create_token(payload: iTokenData, time: string = JWT_EXPIRATION) {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
}