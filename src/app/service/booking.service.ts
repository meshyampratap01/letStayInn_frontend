import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { BookingDTO, getBookingResponse } from '../models/bookings';
import { response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  httpClient = inject(HttpClient);

  totalActiveBookings = new BehaviorSubject<number>(0);
  activeBookings = new BehaviorSubject<BookingDTO[]>([]);

  getActiveBookings() {
    const url = 'bookings';
    return this.httpClient.get<getBookingResponse>(url).pipe(
      tap((res) => {
        console.log(res.data)
        this.totalActiveBookings.next(res.data.length);
        this.activeBookings.next(res.data);
      })
    );
  }

  bookRoom(roomNumber: number, checkInDate: string, checkOutDate: string) {
    const formatToDDMMYYYY = (date: string | Date): string => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const payload = {
      room_number: roomNumber,
      check_in_date: formatToDDMMYYYY(checkInDate),
      check_out_date: formatToDDMMYYYY(checkOutDate),
    };

    console.log('Booking payload:', payload);

    return this.httpClient.post<response>('bookings', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  deleteBooking(bookingID: string){
    const url = `bookings/${bookingID}`
    return this.httpClient.delete<response>(url);
  }
}
