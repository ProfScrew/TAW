import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public static readonly API_BACKEND = environment.URL_BACKEND + environment.VERSION;

  constructor(private http: HttpClient, private auth: AuthService) {

  }

  public get headers() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.auth.token,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    });
    return headers;
  }


  get(url: string, query?: string): Observable<any> {
    console.log("adress: " + ApiService.API_BACKEND + url + (query ? ('?' + query) : ''));
    return this.http.get(ApiService.API_BACKEND + url + (query ? ('?' + query) : ''), { headers: this.headers, observe: 'response' }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      })
    );
  }

  post(url: string, data: any, params?: string): Observable<any> {
    return this.http.post(ApiService.API_BACKEND + url + (params ? (params) : ''), data, { headers: this.headers, observe: 'response'  }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      })
    );
    
  }

  put(url: string, data: any, params?: string): Observable<any> {
    return this.http.put(ApiService.API_BACKEND + url + (params ? (params) : ''), data, { headers: this.headers, observe: 'response'  }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      })
    );
  }

  delete(url: string, params?: string): Observable<any> {
    return this.http.delete(ApiService.API_BACKEND + url + (params ? (params) : ''), { headers: this.headers, observe: 'response'  }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      })
    );
  }

  handleResponse(response: any) { //alert
    if (response.error) {
      return false;
    }
    return response;
  }


}

