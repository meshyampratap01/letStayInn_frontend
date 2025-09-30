import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { getRoomResponse, room } from '../models/room';
import { catchError, tap } from 'rxjs';
import { svcRequestResponse } from '../models/service_request';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  httpClient = inject(HttpClient);

  rooms = signal<room | null>(null);
  availableRooms = signal<number>(0);
  occupiedRooms = signal<number>(0);
  pendingRequests = signal<number>(0);

  constructor() {}

  loadRooms() {
    const roomUrl = 'rooms';
    return this.httpClient.get<getRoomResponse>(roomUrl).pipe(
      tap((res) => {
        const rooms: room[] = res.data;
        // console.log('from my load rooms',rooms)
        rooms.forEach((room) => {
          if (room.is_available) {
            this.availableRooms.update((val) => val + 1);
            // console.log(this.availableRooms())
          } else {
            this.occupiedRooms.update((val) => val + 1);
          }
        });
      }),
      catchError((err) => {
        console.error('fetching room failed', err);
        throw err;
      })
    );
  }

  loadServiceRequest() {
    const url = 'service-requests';
    return this.httpClient.get<svcRequestResponse>(url)
    .pipe(
      tap((res) => {
        const svcRequests = res.data;
        svcRequests.forEach((svcRequest) => {
          if (svcRequest.status === 'Pending') {
            this.pendingRequests.update((val) => val + 1);
          }
        });
      })
    );
  }
}
