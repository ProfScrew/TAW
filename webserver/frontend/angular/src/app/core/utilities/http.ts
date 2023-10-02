import { HttpHeaders, HttpParams } from "@angular/common/http";

export interface iHttpSuccess<PayloadType> {
    status: 200;
    error: false;
    payload: PayloadType;
}

export interface iHttpError {
    status: number;
    error: true;
    message: unknown;
}

export type HttpResponse<PayloadType> = iHttpError | iHttpSuccess<PayloadType>;

export interface RequestOptions {
    headers?: HttpHeaders;
    params?: HttpParams;
}