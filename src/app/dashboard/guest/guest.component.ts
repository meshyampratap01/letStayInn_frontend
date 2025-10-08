import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Roles } from '../../models/user';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenubarModule } from 'primeng/menubar';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BookingService } from '../../service/booking.service';
import { AdminService } from '../../service/admin.service';
import { svcRequest } from '../../models/service_request';
import { FeedbackService } from '../../service/feedback.service';

@Component({
  selector: 'app-guest',
  imports: [HeaderComponent, MenubarModule, RouterOutlet, CardModule],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss',
})
export class GuestComponent {
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private adminService = inject(AdminService);
  private feedbackService = inject(FeedbackService);
  router = inject(Router);

  userName = this.authService.user()?.UserName as string;
  role = this.authService.user()?.Role as Roles;
  id = this.authService.user()?.ID;
  userRole = Roles[this.role];

  totalActiveBookings: number|null= null;
  activeRequests: svcRequest[] = [];
  reviewsGiven: number|null = null;

  constructor(){

    this.bookingService.getActiveBookings().subscribe();

    this.bookingService.totalActiveBookings.subscribe({
      next: (res) => {
        this.totalActiveBookings = res;
      }
    })

        this.feedbackService.getAverageRating().subscribe();
    effect(() => {
      let count = 0;
      this.feedbackService.feedbacks().forEach((fb)=>{
        if(fb.user_id===this.id){
          count++;
        }
      })
      this.reviewsGiven=count;
    });

    this.adminService.loadServiceRequest().subscribe();
    this.adminService.serviceRequests.subscribe({
      next: (res) => {
        this.activeRequests = res.filter(
          (val) => this.id === val.user_id && val.status=== 'Pending'
        );
      },
    });
  }

  menuItems: MenuItem[] = [
    { label: 'My Bookings', routerLink: ['my-bookings'] },
    { label: 'Book Room', routerLink: ['book-room'] },
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

}
