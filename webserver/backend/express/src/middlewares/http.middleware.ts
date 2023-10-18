import { Response, NextFunction } from "express";

export interface iHttpError {
    status:  number;
    error:   true;
    message: string;
}

export interface iHttpSuccess {
    status:  200;
    error:   false;
    payload: unknown;
}

export type HttpResponse = iHttpError | iHttpSuccess;



export function http_response(response: HttpResponse, adapter: Response): void {
    adapter.status(response.status).json(response);
}

export function next_middleware(res: HttpResponse, next: NextFunction): void {
    next(res);
}

export function http_next(err: HttpResponse, next: NextFunction): void {
    next(err);
}