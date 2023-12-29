import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { NotifierComponent } from '../components/notifier/notifier.component';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public static readonly API_BACKEND = environment.URL_BACKEND + environment.VERSION;
  private errorNotificationShown: boolean = false;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router, public notifier: NotifierComponent) {

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
    return this.http.get(ApiService.API_BACKEND + url + (query ? ('?' + query) : ''), { headers: this.headers, observe: 'response' }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      }),
      catchError((err) => {
        this.handleResponse(err);
        return err;
      })
    );
  }

  post(url: string, data: any, params?: string): Observable<any> {
    return this.http.post(ApiService.API_BACKEND + url + (params ? (params) : ''), data, { headers: this.headers, observe: 'response'  }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      }),
      catchError((err) => {
        this.handleResponse(err);
        return err;
      })
    );
    
  }

  put(url: string, data: any, params?: string): Observable<any> {
    return this.http.put(ApiService.API_BACKEND + url + (params ? (params) : ''), data, { headers: this.headers, observe: 'response'  }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      }),
      catchError((err) => {
        this.handleResponse(err);
        return err;
      })
    );
  }

  delete(url: string, params?: string): Observable<any> {
    return this.http.delete(ApiService.API_BACKEND + url + (params ? (params) : ''), { headers: this.headers, observe: 'response'  }).pipe(
      tap((data: any) => {
        this.handleResponse(data);  //calls alert but also returns data
      }),
      catchError((err) => {
        this.handleResponse(err);
        return err;
      })
    );
  }

  handleResponse(response: any) { //alert
    

    if (response.error && this.errorNotificationShown == false) {
      if(response.status == 401 && response.error.message == "Token is blacklisted"){
        this.auth.logout();
        this.notifier.showError(response.status, response.error.message);
        this.router.navigate(['/login']);
      }else if(response.status == 500 && response.error.message == "Redis is down"){
        this.notifier.showError(response.status, response.error.message);
      }else if(response.status == 0){
        this.auth.logout();
        this.notifier.showError(response.status, "Server is not responding");
        this.router.navigate(['/login']);
      }else{
        this.notifier.showError(response.status, response.error.message);
      }
      this.errorNotificationShown = true;
      return false;
    }

    return response;
  }

  setNotificationShown(notificationShown: boolean) {
    this.errorNotificationShown = notificationShown;
  }


}

