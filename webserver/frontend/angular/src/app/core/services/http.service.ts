import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as http from "../utilities/http";
import { Inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public static readonly API_BACKEND = environment.URL_BACKEND + ':' + environment.PORT + '/' + environment.VERSION;
  public readonly ROUTE_BASE;

  constructor(private http: HttpClient, private auth: AuthService, @Inject('ROUTE_BASE') route_base: string) {
    console.debug('HttpService instantiated');
    this.ROUTE_BASE = route_base;
  }

  public get headers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.auth.token,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    });

    return headers;
  }

  public get<T>(...url: string[]): Observable<http.HttpResponse<T>> {
    return this.http.get<http.HttpResponse<T>>(HttpService.API_BACKEND + this.ROUTE_BASE + url.join('/'), { headers: this.headers });
  }

  public post<T>(data: unknown, ...url: string[]): Observable<http.HttpResponse<T>> {
    return this.http.post<http.HttpResponse<T>>(HttpService.API_BACKEND + this.ROUTE_BASE + url.join('/'), data, { headers: this.headers });
  }

  public put<T>(data: unknown, ...url: string[]): Observable<http.HttpResponse<T>> {
    return this.http.put<http.HttpResponse<T>>(HttpService.API_BACKEND + this.ROUTE_BASE + url.join('/'), data, { headers: this.headers });
  }

  public delete<T>(...url: string[]): Observable<http.HttpResponse<T>> {
    return this.http.delete<http.HttpResponse<T>>(HttpService.API_BACKEND + this.ROUTE_BASE + url.join('/'), { headers: this.headers });
  }

}



