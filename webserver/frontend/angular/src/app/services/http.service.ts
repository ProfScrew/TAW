import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface iHttpSuccess<PayloadType> {
    status:  200;
    error:   false;
    payload: PayloadType;
}

export interface iHttpError {
    status:  number;
    error:   true;
    message: unknown;
}

export type HttpResponse<PayloadType> = iHttpError | iHttpSuccess<PayloadType>;

export interface RequestOptions {
    headers?: HttpHeaders;
    params?: HttpParams;
}

export class HttpService {
    public static readonly API_ENDPOINT = 'http://localhost:8080/v1';
    public readonly ROUTE_BASE;

    constructor(private http: HttpClient, private auth: AuthService, route_base: string) {
        console.debug('HttpService instantiated');
        this.ROUTE_BASE = route_base;
    }

    public get headers() {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.auth.token,
            'Cache-Control': 'no-cache',
            'Content-Type':  'application/json',
        });

        return headers;
    }

    public get<T>(...url: string[]): Observable<HttpResponse<T>> {      
        return this.http.get<HttpResponse<T>>(HttpService.API_ENDPOINT + this.ROUTE_BASE + url.join('/'), { headers: this.headers });
    }

    public post<T>(data: unknown, ...url: string[]): Observable<HttpResponse<T>> {
        return this.http.post<HttpResponse<T>>(HttpService.API_ENDPOINT + this.ROUTE_BASE + url.join('/'), data, { headers: this.headers });
    }

    public put<T>(data: unknown, ...url: string[]): Observable<HttpResponse<T>> {
        return this.http.put<HttpResponse<T>>(HttpService.API_ENDPOINT + this.ROUTE_BASE + url.join('/'), data, { headers: this.headers });
    }

    public delete<T>(...url: string[]): Observable<HttpResponse<T>> {
        return this.http.delete<HttpResponse<T>>(HttpService.API_ENDPOINT + this.ROUTE_BASE + url.join('/'), { headers: this.headers });
    }

}