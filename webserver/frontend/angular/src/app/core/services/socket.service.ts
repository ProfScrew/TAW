import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io({ path: '/socket/'});
  }

  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  joinRoom(room: string): void {
    this.socket.emit('joinRoom', room);
  }
}
