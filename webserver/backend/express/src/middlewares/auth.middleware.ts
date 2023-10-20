import { NextFunction, Request, Response } from "express";
import { BasicStrategy } from "passport-http";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "../configs/app.config";
import { User, iUser, iRole } from "../models/user.model";
import { iCategory } from "../models/category.model";
import { iRoom } from "../models/room.model";
import { expressjwt } from "express-jwt";

import { cHttpMessages } from "../utilities/http_messages.util";


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
        if (err) return done(cHttpMessages.generateMessage(500,true,err));
        if (!user) return done(cHttpMessages.generateNotFoundMessage('User'));
        if (!user.checkPassword(password)) return done(cHttpMessages.generateUnauthorizeMessage('Wrong password'));
        return done(null, user);
    });
});

export function authorize(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization!;
    if (!header) { return next(cHttpMessages.generateUnauthorizeMessage('No header provided')); }
    if (!header.startsWith('Bearer ')) return next(cHttpMessages.generateUnauthorizeMessage('Wrong header format'));

    const token  = header.split(' ')[1];
    if (!token)      { return next(cHttpMessages.generateUnauthorizeMessage('No token provided')); }
    if (!JWT_SECRET) { return next(cHttpMessages.internalServerError) }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) { return next(cHttpMessages.generateUnauthorizeMessage('Invalid token.')); }
        req.user = decoded;
        next();
    });
}

export function create_token(payload: iTokenData, time: string = JWT_EXPIRATION) {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
}