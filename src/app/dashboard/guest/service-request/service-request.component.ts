import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { AdminService } from '../../../service/admin.service';
import { AuthService } from '../../../service/auth.service';
import { BookingService } from '../../../service/booking.service';
import { RoomService } from '../../../service/room.service';
import { svcRequest } from '../../../models/service_request';

import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-service-request',
  standalone: true,
  imports: [
    TitleCasePipe,
    ProgressSpinnerModule,
    CommonModule,
    ToastModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
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
  selectedType: string = '';
  requestDetails: string = '';

  user = this.authService.user();

  constructor() {
    this.adminService.loadServiceRequest().subscribe();

    this.adminService.serviceRequests.subscribe({
      next: (res) => {
        // this.serviceRequests = res.filter(
        //   (val) => this.user?.ID === val.user_id
        // );
        this.serviceRequests = res;
      },
    });

    this.bookingService.getActiveBookings().subscribe();

    this.bookingService.activeBookings.subscribe({
      next: (bookings) => {
        this.roomOptions = bookings.map((b) => ({
          label: `Room ${b.room_num}`,
          value: b.room_num,
        }));
      },
    });
  }

  openDialog(type: 'Cleaning' | 'Food') {
    this.selectedRoom = null;
    this.selectedType = type;
    this.requestDetails = '';
    this.requestTypeOptions = [{ label: type, value: type }];
    this.requestDialogVisible = true;
  }
  
  submitRequest() {
    if (
      !this.selectedRoom ||
      !this.selectedType ||
      !this.requestDetails.trim()
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Form',
        detail: 'Please fill in all fields before submitting.',
      });
      return;
    }

    const payload = {
      room_num: this.selectedRoom.value,
      type: this.selectedType,
      details: this.requestDetails,
    };

    this.isLoading = true;

    this.roomService
      .submitRequest(payload.room_num, payload.type, payload.details)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.requestDialogVisible = false;
          console.log(res)

          this.selectedRoom = null;
          this.selectedType = '';
          this.requestDetails = '';

          this.messageService.add({
            severity: 'success',
            summary: 'Request Submitted',
            detail: 'Your service request has been submitted successfully.',
          });
          this.adminService.loadServiceRequest().subscribe();
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Submission Failed',
            detail: 'Something went wrong. Please try again.',
          });
        },
      });
  }

  requestService() {
    this.selectedRoom = null;
    // this.selectedType = type;
    this.requestDetails = '';
    this.requestTypeOptions = [
      { label: 'Cleaning', value: 'Cleaning' },
      { label: 'Food', value: 'Food' },
    ];
    this.requestDialogVisible = true;
  }

  onSelectService(event: DropdownChangeEvent){
    this.selectedType = event.value;
  }

  get isFormValid(): boolean {
  return (
    this.selectedRoom !== null &&
    this.selectedType.trim() !== '' &&
    this.requestDetails.trim().length > 0 &&
    this.requestDetails.trim().length >= 5 &&
    this.requestDetails.trim().length <= 120
  );
}
}
