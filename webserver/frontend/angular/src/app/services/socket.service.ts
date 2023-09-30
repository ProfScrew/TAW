import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client'
import { AuthService } from './auth.service';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;

  constructor(private auth: AuthService) {
    this.socket = io(AuthService.API_ENDPOINT);
  }

  onNotify<T=void>(channel: string): Observable<T> {
    if (!this.socket) { throw new Error("Socket not connected"); }
    return fromEvent<T>(this.socket!, channel);
  }
}
