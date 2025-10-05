import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../service/auth.service';
import { Roles } from '../../models/user';
import { Card, CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AdminService } from '../../service/admin.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FeedbackService } from '../../service/feedback.service';
import { RoomService } from '../../service/room.service';
import { ChartModule } from 'primeng/chart';
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
export class AdminComponent {
  @ViewChild('child-container') childContainer!: ElementRef;
  private router = inject(Router);

  authService = inject(AuthService);
  feedbackSvc = inject(FeedbackService);
  roomService = inject(RoomService);
  employeeService = inject(EmployeeService);

  isRoomLoading = signal(true);
  isServiceLoading = signal(true);
  isFeedbackLoading = signal(true);

  userName = this.authService.user()?.UserName as string;
  role = this.authService.user()?.Role as Roles;
  userRole = Roles[this.role];

  availableRooms: number = 0;
  occupiedRooms: number = 0;

  availableEmployees = 0;
  unavailableEmployees = 0;

  pendingRequests: number = 0;

  items: MenuItem[] = [];

  adminService = inject(AdminService);

  averageRating = signal<number>(0);

  roomChartData = {};

  employeeChartData = {};

  chartOptions = {};

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

  ngOnInit(): void {
    this.roomService.loadRooms().subscribe({
      next: () => {
        this.roomService._availableRooms.subscribe({
          next: (val) => {
            this.availableRooms = val;
          },
        });
        this.roomService._occupiedRooms.subscribe({
          next: (val) => {
            this.occupiedRooms = val;
          },
        });
        this.isRoomLoading.set(false);
      },
    });

    this.adminService.loadServiceRequest().subscribe({
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

    this.feedbackSvc.getAverageRating().subscribe({
      next: (res) => {
        this.isFeedbackLoading.set(false);
        this.averageRating.set(res);
      },
    });

    this.adminService._pendingRequests.subscribe({
      next: (val) => {
        this.pendingRequests = val;
      },
    });

    this.employeeService.loadEmployee().subscribe();

    this.employeeService._availableEmployee.subscribe({
      next: (res) => {
        this.availableEmployees = res;
        this.updateRoomChart();
      },
    });

    this.employeeService._unavailableEmployee.subscribe({
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

  // availableRooms = this.adminService.availableRooms;
  // occupiedRooms = this.adminService.occupiedRooms;
  // pendingSvcRqst = this.adminService.pendingRequests;
}
