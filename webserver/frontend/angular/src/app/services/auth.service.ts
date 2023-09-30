import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { iRole } from '../@types/role';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

type tRawToken = string;

interface iTokenData {
  name: string,
  surname: string,
  email: string,
  role: iRole
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: tRawToken = '';

  constructor(private http: HttpClient, router: Router) {
    console.debug('UserAccessService instantiated');

    const auth = localStorage.getItem('auth_token');

    if (auth && auth.length > 0) {
      this.auth = auth as tRawToken;
      console.debug('JWT loaded from local storage.');
    } else {
      console.debug('No JWT found in local storage, redirecting to login page.');
      router.navigate(['/login']);
    }
  }

  private set_token(token: tRawToken, remember: boolean): void {
    this.auth = token;
    if (remember) {
      localStorage.setItem('auth_token', token);
    }
  }

  login(email: string, password: string, remember: boolean): Observable<unknown> {
    const options = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(email + ':' + password),
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    }

      return this.http.get(HttpService.API_ENDPOINT + '/users/login/', options).pipe(
        tap((data) => {
          console.debug(JSON.stringify(data));
          const payload = (data as {payload: {token: tRawToken}}).payload;
          const token   = payload.token;
          this.set_token(token, remember);
        })
      );
    }

  logout(): void {
    this.set_token('', false);
    localStorage.removeItem('auth_token');
  }

  get has_token(): boolean   { return this.auth.length > 0; }
  get token():     tRawToken { return this.auth; }
  get name():      string    { return jwt_decode<iTokenData>(this.auth).name; }
  get surname():   string    { return jwt_decode<iTokenData>(this.auth).surname; }
  get email():     string    { return jwt_decode<iTokenData>(this.auth).email; }
  get role():      iRole     { return jwt_decode<iTokenData>(this.auth).role; }
}
