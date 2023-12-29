import { NextFunction, Request, Response } from "express";
import { BasicStrategy } from "passport-http";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION, JWT_EXPIRATION_SECONDS } from "../configs/app.config";
import { User, iUser, iRole } from "../models/user.model";
import { iCategory } from "../models/category.model";
import { iRoom } from "../models/room.model";
import { expressjwt } from "express-jwt";
import { cResponse, eHttpCode } from "./response.middleware";

import { Redis } from "../services/redis.service";


export interface iTokenData {
    name: string,
    surname: string,
    username: string,
    role: iRole,
    category?: iCategory["_id"][],
    room?: iRoom["_id"][],

    iat?: number,
    exp?: number
}

export async function checkBlacklist(username : string, issue_date: Date) {
    return new Promise((resolve, reject) => {
        Redis.get<Date>(username)
            .then((value) => {
                if (value !== null) {
                    const expiration_date = new Date(value);
                    if (expiration_date > issue_date) {
                        console.log("🔴 🧑\tToken of " + username + " is blacklisted");
                        resolve(true);
                    } else {
                        console.log("🟢 🧑\tToken of " + username + " is not blacklisted");
                        resolve(false);
                    }
                } else {
                    console.log("🟢 🧑\tToken of " + username + " is not blacklisted");
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const authenticate = new BasicStrategy(function(username: string, password: string, done: Function) {

    User.findOne({ username: username }, (err: unknown, user: iUser) => {
        if (err) return done(cResponse.error(eHttpCode.INTERNAL_SERVER_ERROR, err.toString()));
        if (!user) return done(cResponse.error(eHttpCode.NOT_FOUND, 'User not found'));
        if (!user.checkPassword(password)) return done(cResponse.error(eHttpCode.UNAUTHORIZED, 'Wrong password'));
        return done(null, user);
    });
});


export function authorize(req: Request, res: Response, next: NextFunction) {

    //check if redis is up
    if (!Redis.getStatus()) {
        return next(cResponse.error(eHttpCode.INTERNAL_SERVER_ERROR, 'Redis is down'));
    }

    const header = req.headers.authorization!;
    if (!header) { return next(cResponse.error(eHttpCode.UNAUTHORIZED,'No header provided')); }
    if (!header.startsWith('Bearer ')) return next(cResponse.error(eHttpCode.UNAUTHORIZED,'Invalid header'));

    const token = header.split(' ')[1];
    if (!token) { return next(cResponse.error(eHttpCode.UNAUTHORIZED, 'No token provided')); }
    if (!JWT_SECRET) { return next(cResponse.genericMessage(eHttpCode.INTERNAL_SERVER_ERROR)) }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) { return next(cResponse.error(eHttpCode.UNAUTHORIZED,'Invalid token')) }
        req.user = decoded;
        const author = decoded as iTokenData;
        if (!author.iat) {
            return next(cResponse.error(eHttpCode.UNAUTHORIZED,'Invalid token data'));
        }
        checkBlacklist(author.username,new Date(author.iat * 1000))
            .then((isBlacklisted) => {
                if (isBlacklisted) {
                   return next(cResponse.error(eHttpCode.UNAUTHORIZED, 'Token is blacklisted'));
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
        next();
    });
}

export function create_token(payload: iTokenData, time: string = JWT_EXPIRATION) {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
}

export function blacklistUser(username: string, issue_date: Date) {
    Redis.set<Date>(username, issue_date, JWT_EXPIRATION_SECONDS);
    console.log("🔴\tBlacklisted tokens of user:" + username);
}