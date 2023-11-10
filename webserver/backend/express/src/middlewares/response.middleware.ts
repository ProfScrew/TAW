import { Router, Request, Response, NextFunction } from "express";


export enum eHttpCode {
    //2xx
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    //3xx
    MOVED_PERMANENTLY = 301,
    //4xx
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    TOO_MANY_REQUESTS = 429,
    //5xx
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,

}

export class cResponse {
    statusCode: number;
    error: boolean;
    message?: string;
    payload?: unknown;

    constructor(
        statusCode: number,
        error: boolean,
        message?: string,
        payload?: unknown,
    ) {

        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.payload = payload;
    }

    //1xx
    public static informational(statusCode: number, message: string) {
        return new cResponse(statusCode, false, message);
    }
    
    //2xx
    public static success(statusCode: number, payload: unknown) {
        return new cResponse(statusCode, false, undefined, payload);
    }

    //3xx
    public static redirect(statusCode: number, message: string) {
        return new cResponse(statusCode, false, message);
    }

    //4xx
    public static error(statusCode: number, message: string) {
        return new cResponse(statusCode, true, message);
    }

    //5xx
    public static serverError(statusCode: number, message: string) {
        return new cResponse(statusCode, true, message);
    }


    public static genericMessage(statusCode: eHttpCode, payload?: unknown) {
        switch (statusCode) {
            case eHttpCode.OK:
                return new cResponse(statusCode, false, "OK", payload);
            case eHttpCode.CREATED:
                return new cResponse(statusCode, false, "Created", payload);
            case eHttpCode.ACCEPTED:
                return new cResponse(statusCode, false, "Accepted", payload);
            case eHttpCode.NO_CONTENT:
                return new cResponse(statusCode, false, "No content");
            case eHttpCode.MOVED_PERMANENTLY:
                return new cResponse(statusCode, false, "Moved permanently");
            case eHttpCode.BAD_REQUEST:
                return new cResponse(statusCode, true, "Bad request");
            case eHttpCode.UNAUTHORIZED:
                return new cResponse(statusCode, true, "Unauthorized");
            case eHttpCode.FORBIDDEN:
                return new cResponse(statusCode, true, "Forbidden");
            case eHttpCode.NOT_FOUND:
                return new cResponse(statusCode, true, "Not found");
            case eHttpCode.METHOD_NOT_ALLOWED:
                return new cResponse(statusCode, true, "Method not allowed");
            case eHttpCode.TOO_MANY_REQUESTS:
                return new cResponse(statusCode, true, "Too many requests");
            case eHttpCode.INTERNAL_SERVER_ERROR:
                return new cResponse(statusCode, true, "Internal server error");
            case eHttpCode.BAD_GATEWAY:
                return new cResponse(statusCode, true, "Bad gateway");
            case eHttpCode.SERVICE_UNAVAILABLE:
                return new cResponse(statusCode, true, "Service unavailable");
            case eHttpCode.GATEWAY_TIMEOUT:
                return new cResponse(statusCode, true, "Gateway timeout");
            default:
                return new cResponse(500, true, "Unknown error");
        }
    }

}

export function responseHandler(
    customResponse: cResponse,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (customResponse as cResponse === undefined) {
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
    if (customResponse.error) {
        return res.status(customResponse.statusCode).json({ error: true, message: customResponse.message });
    } else {
        return res.status(customResponse.statusCode).json({ error: false, message: customResponse.message, payload: customResponse.payload });
    }

}





