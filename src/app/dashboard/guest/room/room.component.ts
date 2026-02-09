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
import { CalendarModule } from 'primeng/calendar';

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
    CalendarModule,
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

  minDate: Date = new Date();

  selectedRoom: room = {
    number: 0,
    type: '',
    price: 0,
    is_available: true,
    description: '',
  };

  rooms: room[] = [];
  roomOptions: room[] = [];

  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;

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
    this.checkInDate = null;
    this.checkOutDate = null;
    this.validateDates();
  }

  get isFormValid(): boolean {
  return (
    this.selectedRoom &&
    this.selectedRoom.number !== 0 &&
    this.checkInDate !== null &&
    this.checkOutDate !== null &&
    this.checkOutDate > this.checkInDate &&
    !this.errorMessage
  );
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

    const checkInStr = this.formatDate(this.checkInDate);
    const checkOutStr = this.formatDate(this.checkOutDate);

    this.isLoading = true;
    this.bookingService
      .bookRoom(this.selectedRoom.number, checkInStr, checkOutStr)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status_code === 201) {
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
