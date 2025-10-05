import { HttpClient } from '@angular/common/http';
import { inject, Injectable, ɵIS_INCREMENTAL_HYDRATION_ENABLED } from '@angular/core';
import { getRoomResponse, room } from '../models/room';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  httpClient = inject(HttpClient);

  rooms = new BehaviorSubject<room[]>([]);
  _availableRooms = new BehaviorSubject<number>(0);
  _occupiedRooms = new BehaviorSubject<number>(0);

  constructor() {}

  loadRooms() {
    const roomUrl = 'rooms';
    return this.httpClient.get<getRoomResponse>(roomUrl).pipe(
      tap((res) => {
        let aavailable_rooms: number = 0;
        let occupied_rooms: number = 0;
        res.data.sort((a,b) => a.number-b.number);
        this.rooms.next(res.data);

        res.data.forEach((room) => {
          if (room.is_available) {
            aavailable_rooms = aavailable_rooms + 1;
          } else {
            occupied_rooms = occupied_rooms + 1;
          }
          this._availableRooms.next(aavailable_rooms);
          this._occupiedRooms.next(occupied_rooms);
        });
      }),
      catchError((err) => {
        console.error('fetching room failed', err);
        throw err;
      })
    );
  }

  addRoom(room: room) {
    const url = 'rooms';
    return this.httpClient.post<response>(url, {
      number: Number(room.number),
      type: room.type,
      price: room.price,
      description: room.description,
    });
  }

  deleteRoom(roomNum: number){
    const url = `rooms/${roomNum}`;
    return this.httpClient.delete<response>(url);
  }

  updateRoom(room: room){
    const url = `rooms/${room.number}`;
    return this.httpClient.put<response>(url,{
      type: room.type,
      price: room.price,
      is_available: room.is_available,
      description: room.description,
    })
  }

  submitRequest(roomNumber: number, type: string, details: string){
    const url = `service-requests`
    return this.httpClient.post<response>(url,{
      room_num: roomNumber,
      type: type,
      details: details,
    })
  }
}
