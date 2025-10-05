import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AdminService } from '../../../service/admin.service';
import { AuthService } from '../../../service/auth.service';
import { BookingService } from '../../../service/booking.service';
import { RoomService } from '../../../service/room.service';
import { svcRequest } from '../../../models/service_request';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-service-request',
  standalone: true,
  imports: [
    TitleCasePipe,
    ProgressSpinnerModule,
    DatePipe,
    CommonModule,
    ToastModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss',
})
export class ServiceRequestComponent {
  adminService = inject(AdminService);
  authService = inject(AuthService);
  roomService = inject(RoomService);
  bookingService = inject(BookingService);
  messageService = inject(MessageService);

  serviceRequests: svcRequest[] = [];
  roomOptions: any[] = [];
  requestTypeOptions: any[] = [];

  isLoading = false;
  requestDialogVisible = false;

  selectedRoom: any = null;
  selectedType: any = '';
  requestDetails: string = '';

  user = this.authService.user();

  constructor() {
    this.adminService.loadServiceRequest().subscribe();

    this.adminService.serviceRequests.subscribe({
      next: (res) => {
        this.serviceRequests = res.filter(val => this.user?.ID === val.user_id);
      },
    });

    this.bookingService.getActiveBookings().subscribe();

    this.bookingService.activeBookings.subscribe({
      next: (bookings) => {
        this.roomOptions = bookings.map((b) => ({
          label: `Room ${b.room_number}`,
          value: b.room_number
        }));
      }
    });
  }

  openDialog(type: 'Cleaning' | 'Food') {
    this.selectedRoom = null;
    this.selectedType = type;
    this.requestDetails = '';
    this.requestTypeOptions = [{ label: type, value: type }];
    this.requestDialogVisible = true;
  }

  requestCleaning() {
    this.openDialog('Cleaning');
  }

  orderFood() {
    this.openDialog('Food');
  }

  submitRequest() {
    if (!this.selectedRoom || !this.selectedType || !this.requestDetails.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill in all fields before submitting.'
      });
      return;
    }

    const payload = {
      room_number: this.selectedRoom.value,
      type: this.selectedType.value,
      details: this.requestDetails
    };

    this.isLoading = true;

    this.roomService.submitRequest(payload.room_number, payload.type, payload.details).subscribe({
      next: () => {
        this.isLoading = false;
        this.requestDialogVisible = false;

        this.selectedRoom = null;
        this.selectedType = '';
        this.requestDetails = '';

        this.messageService.add({
          severity: 'success',
          summary: 'Request Submitted',
          detail: 'Your service request has been submitted successfully.'
        });
        this.adminService.loadServiceRequest().subscribe();
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Submission Failed',
          detail: 'Something went wrong. Please try again.'
        });
      }
    });
  }
}