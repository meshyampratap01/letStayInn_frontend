import { Component, inject, OnDestroy, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../service/auth.service';
import { EmployeeService } from '../../service/employee.service';
import { Roles } from '../../models/user';
import { svcRequest } from '../../models/service_request';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee',
  imports: [
    ToggleSwitchModule,
    FormsModule,
    HeaderComponent,
    TableModule,
    CommonModule,
    DropdownModule,
    ToastModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnDestroy {
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private messageService = inject(MessageService);

  role: Roles = this.authService.user()?.Role as Roles;

  userName: string = this.authService.user()?.UserName as string;
  userRole: string = Roles[this.role];
  userID: string = this.authService.user()?.ID as string;

  isLoading: boolean = false;
  availability = signal<boolean>(true);

  assignedTask: number = 0;
  completedTasks: number = 0;
  availableTasks: number = 0;
  assignedServiceRequest: svcRequest[] = [];

  getAssignedReqeustSubscription?:Subscription;
  updateRequestStatusSubscription?:Subscription;

  constructor() {
    this.availability.set(true);
    this.employeeService.getAssignedServiceRequest().subscribe();
    this.employeeService._assignedServiceReqeust.subscribe({
      next: (res) => {
        console.log(res);
        this.assignedServiceRequest = res as svcRequest[];
        this.assignedServiceRequest.sort((a,b)=>{
          return b.status.localeCompare(a.status);
        })
        this.assignedTask = res?.length;
        const taskInProgress = res.filter((s) => {
          return s.status === 'Pending' || s.status=="In Progress";
        });
        console.log('inprogress',taskInProgress)

        this.availableTasks = taskInProgress.length;
        const completedTasks = res.filter((s) => {
          return s.status == 'Done';
        });
        console.log('completed',completedTasks)
        this.completedTasks = completedTasks.length;
      },
    });
  }

  statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
  ];

  updateRequestStatus(request: svcRequest, newStatus: DropdownChangeEvent) {
    this.isLoading=true;
    this.updateRequestStatusSubscription=this.employeeService.updateRequestStatus(request,newStatus.value).subscribe({
      next: (res)=>{
        this.isLoading=false;
        this.getAssignedReqeustSubscription=this.employeeService.getAssignedServiceRequest().subscribe();
        this.messageService.add({
          severity: 'success',
          closable: true,
          summary: 'Updated Status successfully!',
          life: 4000,
        });
      },
      error: (err)=>{
        this.isLoading=false;this.messageService.add({
          severity: 'error',
          summary: 'Unable to update the status!',
          life: 3000,
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.getAssignedReqeustSubscription?.unsubscribe();
    this.updateRequestStatusSubscription?.unsubscribe();
  }
}
