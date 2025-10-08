import { HttpClient } from '@angular/common/http';
import { inject, Injectable, input, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { feedback, getFeedbackResponse } from '../models/feedback';
import { response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  httpClient = inject(HttpClient);
  avgRating = signal<number>(0);

  feedbacks = signal<feedback[]>([]);

  totalFeedbacks = signal<number>(0);

  constructor() {}

  getAverageRating(): Observable<number> {
    const apiUrl = 'feedbacks';
    return this.httpClient.get<getFeedbackResponse>(apiUrl)
    .pipe(
      tap((res)=>{
        this.feedbacks.set(res.data);
      })
    )
    .pipe(
      tap((res)=>{
        this.totalFeedbacks.set(res.data.length);
      })
    )
    .pipe(
      map((response) => {
        const totalRating = response.data.reduce(
          (sum, feedback) => sum + feedback.rating,
          0
        );

        if (response.data.length === 0) {
          return 0;
        }

        return totalRating / response.data.length;
      })
    )
  }

  submitFeedback(newFeedback:feedback){
    const url = 'feedbacks';
    return this.httpClient.post<response>(url,{
      message: newFeedback.message,
      rating: newFeedback.rating,
    })
  }
}
