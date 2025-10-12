import { Component, effect, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../service/auth.service';
import { Roles } from '../../models/user';
import { HeaderComponent } from '../../shared/header/header.component';
import { BookingService } from '../../service/booking.service';
import { AdminService } from '../../service/admin.service';
import { svcRequest } from '../../models/service_request';
import { FeedbackService } from '../../service/feedback.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-guest',
  imports: [HeaderComponent, MenubarModule, RouterOutlet, CardModule],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss',
})
export class GuestComponent implements OnDestroy{
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private adminService = inject(AdminService);
  private feedbackService = inject(FeedbackService);
  private router = inject(Router);

  userName: string = this.authService.user()?.UserName as string;
  role: Roles = this.authService.user()?.Role as Roles;
  id: string | undefined = this.authService.user()?.ID;
  userRole: string = Roles[this.role];

  totalActiveBookings: number | null = null;
  activeRequests: svcRequest[] = [];
  reviewsGiven: number | null = null;

  getActiveBookingsSubscription?: Subscription;
  totalbookingsSubscription?: Subscription;
  getAverageRatingSubscription?: Subscription;
  loadserviceReqeustSubscription?: Subscription;
  serviceReqeustSubscription?: Subscription;


  constructor() {
    this.getActiveBookingsSubscription=this.bookingService.getActiveBookings().subscribe();

    this.totalbookingsSubscription=this.bookingService.totalActiveBookings.subscribe({
      next: (res) => {
        this.totalActiveBookings = res;
      },
    });

    this.getAverageRatingSubscription=this.feedbackService.getAverageRating().subscribe();
    effect(() => {
      let count = 0;
      this.feedbackService.feedbacks().forEach((fb) => {
        if (fb.user_id === this.id) {
          count++;
        }
      });
      this.reviewsGiven = count;
    });

    this.loadserviceReqeustSubscription=this.adminService.loadServiceRequest().subscribe();
   this.serviceReqeustSubscription= this.adminService.serviceRequests.subscribe({
      next: (res) => {
        this.activeRequests = res.filter(
          (val) => this.id === val.user_id && val.status === 'Pending'
        );
      },
    });
  }

  menuItems: MenuItem[] = [
    { label: 'Book Room', routerLink: ['book-room'] },
    { label: 'My Bookings', routerLink: ['my-bookings'] },
    { label: 'Services', routerLink: ['service-requests'] },
    { label: 'Feedback', routerLink: ['feedbacks'] },
  ];

  navigateAndScroll(route: string) {
    this.router.navigate([`guest/${route}`]).then(() => {
      setTimeout(() => {
        const element = document.getElementById('child-container');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  ngOnDestroy(): void {
    this.totalbookingsSubscription?.unsubscribe();
    this.serviceReqeustSubscription?.unsubscribe();
    this.getAverageRatingSubscription?.unsubscribe();
    this.getActiveBookingsSubscription?.unsubscribe();
    this.loadserviceReqeustSubscription?.unsubscribe();
  }
}
