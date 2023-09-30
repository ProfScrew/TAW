import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { HttpResponse, HttpService } from './http.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export enum TableStatus {
    UNSET = 'unset',
    LOCKED = 'locked',
    RESERVED = 'reserved',
    OCCUPIED = 'occupied',
    ORDERING = 'ordering',
    WAITING = 'waiting',
    CLOSING = 'closing'
}

export interface Table {
    _id: string;
    name: string;
    status: TableStatus;
    physical_tables: string[];
    guests: number;
    capacity: number;
    room: string;
    order?: string;
}

@Injectable({ providedIn: 'root' })
export class TableService extends HttpService {
    constructor(http: HttpClient, auth: AuthService) {
        super(http, auth, '/tables');
        console.debug('TableService instantiated');
    }

    public get_all() {
        return this.get<Table[]>('/');
    }
}

