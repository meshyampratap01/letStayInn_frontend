import { Component, effect, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { feedback } from '../../../models/feedback';
import { FeedbackService } from '../../../service/feedback.service';
import { AuthService } from '../../../service/auth.service';
import { response } from '../../../models/response';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CardModule,
    RatingModule,
    DatePipe,
    FormsModule,
    CommonModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  private feebackService = inject(FeedbackService);
  private authService = inject(AuthService);
  private userID = this.authService.user()?.ID;
  private messageService = inject(MessageService);
  isLoading = false;
  feedbackList: feedback[] = [];

  showDialog = false;
  reviewInvalid = false;

  newFeedback: feedback = {
    id: '',
    user_id: this.userID ?? '',
    user_name: this.authService.user()?.UserName ?? '',
    message: '',
    created_at: new Date().toISOString(),
    room_num: 0,
    booking_id: '',
    rating: 0,
  };

  constructor() {
    this.feebackService.getAverageRating().subscribe();
    effect(() => {
      this.feedbackList = this.feebackService
        .feedbacks()
        .filter((fb) => fb.user_id === this.userID);
    });
  }

  validateReview() {
    const trimmed = this.newFeedback.message.trim();
    this.reviewInvalid = trimmed.length === 0 || trimmed.length > 175;
  }

  submitFeedback() {
    this.isLoading = true;
    this.feebackService.submitFeedback(this.newFeedback).subscribe({
      next:(res)=>{
        this.isLoading=false;
        if(res.code === 201){
          this.feebackService.getAverageRating().subscribe();
          this.messageService.add({
            severity: 'success',
            summary: 'Feedback Submitted Successfully!',
            detail: res.message,
          })
          this.showDialog=false;
          this.newFeedback.rating=0;
          this.newFeedback.message='';
        }else{
          this.messageService.add({
            severity: 'warn',
            summary: 'Feedback Submission Issue',
            detail: res.message,
          })
        }
      },
      error:(err: response)=>{
        this.isLoading=false;
        this.messageService.add({
          severity:'error',
          summary: 'Feedback Not Submitted!',
          detail: "No active or confirmed booking found for feedback",
        })
      }
    })
  }
}
