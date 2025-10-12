import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RoomService } from '../../../service/room.service';
import { room } from '../../../models/room';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../service/booking.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    Toast,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent {
  roomService = inject(RoomService);
  bookingService = inject(BookingService);
  messageService = inject(MessageService);

  bookingDialogVisible = false;

  isLoading = false;

  selectedRoom: room = {
    number: 0,
    type: '',
    price: 0,
    is_available: true,
    description: '',
  };

  rooms: room[] = [];
  roomOptions: room[] = [];

  checkInDate: string | null = null;
  checkOutDate: string | null = null;

  amenities = ['WiFi', 'TV', 'AC'];

  errorMessage: string = '';

  constructor() {
    this.roomService.loadRooms().subscribe();
    this.roomService.rooms.subscribe({
      next: (res) => {
        this.rooms = res;
        this.roomOptions = this.rooms;
      },
    });
  }

  getAmenityIcon(amenity: string): string {
    const icons: { [key: string]: string } = {
      WiFi: 'wifi',
      TV: 'tv',
      AC: 'ac_unit',
    };
    return icons[amenity] || 'check';
  }

  onRoomClick(room: room) {
    this.selectedRoom = room;
    this.bookingDialogVisible = true;
    this.errorMessage = '';
  }

  confirmBooking() {
    this.errorMessage = '';

    if (!this.checkInDate || !this.checkOutDate) {
      this.errorMessage = 'Please select both check-in and check-out dates.';
      return;
    }

    if (this.checkOutDate <= this.checkInDate) {
      this.errorMessage = 'Check-out date must be after check-in date.';
      return;
    }

    this.isLoading = true;
    this.bookingService
      .bookRoom(this.selectedRoom.number, this.checkInDate, this.checkOutDate)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 201) {
            this.bookingService.getActiveBookings().subscribe();
            this.messageService.add({
              severity: 'success',
              summary: 'Booking Successful',
              detail: res.message,
            });
            this.roomService.loadRooms().subscribe();
            this.bookingDialogVisible = false;
            this.checkInDate = null;
            this.checkOutDate = null;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Booking Issue',
              detail: res.message,
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Booking Failed',
            detail: 'Something went wrong. Please try again later.',
          });
        },
      });
  }

  validateDates() {
    if (!this.checkInDate || !this.checkOutDate) {
      this.errorMessage = '';
      return;
    }

    if (this.checkOutDate <= this.checkInDate) {
      this.errorMessage = 'Check-out date must be after check-in date.';
    } else {
      this.errorMessage = '';
    }
  }
}
