import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Rating, RatingModule } from 'primeng/rating';
import { AdminService } from '../../../service/admin.service';
import { FeedbackService } from '../../../service/feedback.service';
import { feedback } from '../../../models/feedback';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  imports: [RatingModule,CommonModule,CardModule,FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  feedbackService = inject(FeedbackService)

  feedbacks = signal<feedback[]>([]);
  averageRating = signal<number>(0)
  totalFeedback = signal<number>(0);

  constructor(){
    effect(()=>{
      // this.averageRating.set(this.feedbackService.avgRating())
      this.feedbacks.set(this.feedbackService.feedbacks())
      this.totalFeedback.set(this.feedbackService.totalFeedbacks())
    })

    this.feedbackService.getAverageRating().subscribe({
      next: (res)=>{
        this.averageRating.set(res);
      }
    })
  }
}
