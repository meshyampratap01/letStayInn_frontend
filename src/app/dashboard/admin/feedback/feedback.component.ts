import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { FeedbackService } from '../../../service/feedback.service';
import { feedback } from '../../../models/feedback';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-feedback',
  imports: [RatingModule, CommonModule, CardModule, FormsModule, PaginatorModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  feedbackService = inject(FeedbackService)

  feedbacks = signal<feedback[]>([]);
  paginatedFeedbacks = signal<feedback[]>([]);
  averageRating = signal<number>(0)
  totalFeedback = signal<number>(0);

  rowsPerPage = 8;
  currentPage = signal<number>(0);

  constructor(){
    this.feedbackService.getAverageRating().subscribe({
      next: (res)=>{
        this.averageRating.set(res);
      }
    })

    effect(()=>{
      const allfeedbacks = this.feedbackService.feedbacks();
      this.feedbacks.set(allfeedbacks);
      this.totalFeedback.set(this.feedbackService.totalFeedbacks())
      this.updatePaginatedFeedbacks();
    })
  }
  updatePaginatedFeedbacks(){
    const start = this.currentPage()*this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedFeedbacks.set(this.feedbacks().slice(start,end));
  }

  onPageChange(event: any){
    this.currentPage.set(event.page);
    this.updatePaginatedFeedbacks();
  }
}
