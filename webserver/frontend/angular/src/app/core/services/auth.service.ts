import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { tap } from 'rxjs/operators';
import { Observable} from 'rxjs';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { iRole } from '../models/user.model';


interface iTokenData {
  exp: number;
  name: string,
  surname: string,
  role: iRole,
  room: [string],
  category: [string],
  username: string,
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private auth: string = '';

  constructor(private http: HttpClient, router: Router) {
    console.debug('UserAccessService instantiated');

    const auth = localStorage.getItem('auth_token');

    if (auth && auth.length > 0) {
      this.auth = auth as string;
      console.debug('JWT loaded from local storage.');
    } else {
      console.debug('No JWT found in local storage, redirecting to login page.');
      router.navigate(['/login']);   //<-- if no token is found, redirect to login page
    }
  }

  private set_token(token: string, remember: boolean): void {
    this.auth = token;
    if (remember) {
      localStorage.setItem('auth_token', token);
    }
  }

  login(username: string, password: string, remember: boolean): Observable<unknown> {
    const options = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(username + ':' + password),
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      observe: 'response' as 'response',
    };
    console.log(options);
    return this.http.post(environment.URL_BACKEND + environment.VERSION + '/users/login/', {}, options).pipe(
      tap((response: any) => {
        const token = response.body.payload as string;
        this.set_token(token, remember);
      })
    );
  }

  logout(): void {

    this.set_token('', false);
    localStorage.removeItem('auth_token');
  }


  isLogged(): boolean {
    if (this.has_token && this.exp && this.exp * 1000 > Date.now()) return true;
    return false;
  }

  get has_token(): boolean { return this.auth.length > 0; }
  get token(): string { return this.auth; }
  get name(): string { return jwt_decode<iTokenData>(this.auth).name; }
  get surname(): string { return jwt_decode<iTokenData>(this.auth).surname; }
  get username(): string { return jwt_decode<iTokenData>(this.auth).username; }
  get role(): iRole { return jwt_decode<iTokenData>(this.auth).role; }
  get exp(): number { return jwt_decode<iTokenData>(this.auth).exp; }
  get room(): [string] { return jwt_decode<iTokenData>(this.auth).room; }
  get category(): [string] { return jwt_decode<iTokenData>(this.auth).category; }

}
