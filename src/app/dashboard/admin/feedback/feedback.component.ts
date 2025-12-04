import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { FeedbackService } from '../../../service/feedback.service';
import { feedback } from '../../../models/feedback';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-feedback',
  imports: [
    RatingModule,
    CommonModule,
    CardModule,
    FormsModule,
    PaginatorModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinner,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  feedbackService = inject(FeedbackService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  feedbacks = signal<feedback[]>([]);
  paginatedFeedbacks = signal<feedback[]>([]);
  averageRating = signal<number>(0);
  totalFeedback = signal<number>(0);

  isLoading = false;

  rowsPerPage = 8;
  currentPage = signal<number>(0);

  constructor() {
    this.feedbackService.getAverageRating().subscribe({
      next: (res) => {
        this.averageRating.set(res);
      },
    });

    effect(() => {
      const allfeedbacks = this.feedbackService.feedbacks();
      this.feedbacks.set(allfeedbacks);
      this.totalFeedback.set(this.feedbackService.totalFeedbacks());
      this.updatePaginatedFeedbacks();
    });
  }
  updatePaginatedFeedbacks() {
    const start = this.currentPage() * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedFeedbacks.set(this.feedbacks().slice(start, end));
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page);
    this.updatePaginatedFeedbacks();
  }

  onSelectFeedback(event: Event, feedback: feedback) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to remove ${feedback.user_name}'s feedback?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        // outlined: true,
      },
      acceptButtonProps: {
        label: 'Yes',
      },
      accept: () => {
        this.isLoading = true;
        this.feedbackService.deleteFeedback(feedback.id).subscribe({
          next: (res) => {
            this.feedbackService.getAverageRating().subscribe();
            this.isLoading = false;
            this.messageService.add({
              severity: 'info',
              summary: `${feedback.user_name}'s feedback removed!`,
              detail: res.message,
            });
          },
          error: (res) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Some error Occured!',
              life: 3000,
            });
          },
        });
      },
      reject: () => {},
    });
  }
}
