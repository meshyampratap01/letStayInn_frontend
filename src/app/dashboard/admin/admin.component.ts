import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
import { Roles } from '../../models/user';
import { Subscription } from 'rxjs';

import { AuthService } from '../../service/auth.service';
import { AdminService } from '../../service/admin.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuItem } from 'primeng/api';
import { FeedbackService } from '../../service/feedback.service';
import { RoomService } from '../../service/room.service';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-admin',
  imports: [
    HeaderComponent,
    CardModule,
    AvatarModule,
    ProgressSpinnerModule,
    MenubarModule,
    RouterOutlet,
    ChartModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnDestroy, OnInit {
  @ViewChild('child-container') childContainer!: ElementRef;
  private router = inject(Router);

  private authService = inject(AuthService);
  private feedbackSvc = inject(FeedbackService);
  private roomService = inject(RoomService);
  private employeeService = inject(EmployeeService);
  private adminService = inject(AdminService);

  isRoomLoading = signal(true);
  isServiceLoading = signal(true);
  isFeedbackLoading = signal(true);

  userName = this.authService.user()?.UserName as string;
  role = this.authService.user()?.Role as Roles;
  userRole = this.role;

  availableRooms: number = 0;
  occupiedRooms: number = 0;

  availableEmployees: number = 0;
  unavailableEmployees: number = 0;

  pendingRequests: number = 0;

  items: MenuItem[] = [];

  averageRating = signal<number>(0);

  roomChartData = {};

  employeeChartData = {};

  chartOptions = {};

  loadRoomSubscription?: Subscription;
  availableRoomSubscription?: Subscription;
  occupiedRoomSubscription?: Subscription;
  loadReqeustSubscription?: Subscription;
  avgRatingSubscription?: Subscription;
  unavailableEmployeesSubscription?: Subscription;
  availableEmployeesSubscription?: Subscription;
  pendingRequestsSubscription?: Subscription;
  loadEmployeeSubscription?: Subscription;

  ngOnInit(): void {
    this.loadRoomSubscription = this.roomService.loadRooms().subscribe({
      next: () => {
        this.availableRoomSubscription =
          this.roomService._availableRooms.subscribe({
            next: (val) => {
              this.availableRooms = val;
            },
          });
        this.occupiedRoomSubscription =
          this.roomService._occupiedRooms.subscribe({
            next: (val) => {
              this.occupiedRooms = val;
            },
          });
        this.isRoomLoading.set(false);
      },
    });

    this.loadReqeustSubscription = this.adminService
      .loadServiceRequest()
      .subscribe({
        next: () => {
          this.isServiceLoading.set(false);
        },
      });

    this.items = [
      { label: 'Rooms', routerLink: ['rooms'] },
      { label: 'Employees', routerLink: ['employee'] },
      { label: 'Service Requests', routerLink: ['service-requests'] },
      { label: 'Feedback', routerLink: ['feedbacks'] },
    ];

    this.avgRatingSubscription = this.feedbackSvc.getAverageRating().subscribe({
      next: (res) => {
        this.isFeedbackLoading.set(false);
        this.averageRating.set(res);
      },
    });

    this.pendingRequestsSubscription=this.adminService._pendingRequests.subscribe({
      next: (val) => {
        this.pendingRequests = val;
      },
    });

    this.loadEmployeeSubscription=this.employeeService.loadEmployee().subscribe();

   this.availableEmployeesSubscription= this.employeeService._availableEmployee.subscribe({
      next: (res) => {
        this.availableEmployees = res;
        this.updateRoomChart();
      },
    });

    this.unavailableEmployeesSubscription=this.employeeService._unavailableEmployee.subscribe({
      next: (res) => {
        this.unavailableEmployees = res;
        this.updateEmployeeChart();
      },
    });

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  navigateAndScroll(route: string) {
    this.router.navigate([`admin/${route}`]).then(() => {
      setTimeout(() => {
        const element = document.getElementById('child-container');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  updateRoomChart() {
    this.roomChartData = {
      labels: ['Available', 'Occupied'],
      datasets: [
        {
          data: [this.availableRooms, this.occupiedRooms],
          backgroundColor: ['#4caf50', '#f44336'],
          hoverBackgroundColor: ['#66bb6a', '#e57373'],
        },
      ],
    };
  }

  updateEmployeeChart() {
    this.employeeChartData = {
      labels: ['Available', 'Unavailable'],
      datasets: [
        {
          data: [this.availableEmployees, this.unavailableEmployees],
          backgroundColor: ['#2196f3', '#9e9e9e'],
          hoverBackgroundColor: ['#64b5f6', '#bdbdbd'],
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.loadRoomSubscription?.unsubscribe();
    this.avgRatingSubscription?.unsubscribe();
    this.loadReqeustSubscription?.unsubscribe();
    this.loadEmployeeSubscription?.unsubscribe();
    this.occupiedRoomSubscription?.unsubscribe();
    this.availableRoomSubscription?.unsubscribe();
    this.pendingRequestsSubscription?.unsubscribe();
    this.availableEmployeesSubscription?.unsubscribe();
    this.unavailableEmployeesSubscription?.unsubscribe();
  }
}
