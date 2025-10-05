import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BookingDTO } from '../../../models/bookings';
import { BookingService } from '../../../service/booking.service';
import { ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    CommonModule,
    Toast,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  bookings: BookingDTO[] = [];
  bookingService = inject(BookingService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  isLoading = false;
  constructor() {
    this.bookingService.activeBookings.subscribe({
      next: (res) => {
        this.bookings = res;
      }
    });
  }

  confirmDelete(bookingId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this booking?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading= true;
        this.bookingService.deleteBooking(bookingId).subscribe({
          next: (res) => {
            this.isLoading=false;
            if (res.code === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: res.message
              });
              this.bookings = this.bookings.filter(b => b.id !== bookingId);
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Could not delete',
                detail: res.message
              });
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete booking. Please try again.'
            });
          }
        });
      },
      rejectVisible: true,
      acceptLabel: "Yes",
      rejectLabel: 'No',
      // acceptButtonStyleClass: 'custom-confirm-dialog',
      // rejectButtonStyleClass: 'custom-confirm-dialog',
    });
  }
}