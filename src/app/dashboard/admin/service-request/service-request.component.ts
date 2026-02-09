import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { svcRequest } from '../../../models/service_request';
import { EmployeeService } from '../../../service/employee.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-service-request',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss',
})
export class ServiceRequestComponent {
  adminService = inject(AdminService);
  employeeService = inject(EmployeeService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  isLoading = false;

  requests = signal<svcRequest[]>([]);
  staffOptions: { label: string; value: string }[] = [];

  constructor() {
    this.adminService.loadServiceRequest().subscribe({
      next: (res) => {
        let serviceRequests: svcRequest[] = res.data;
        this.requests.set(serviceRequests);
      },
    });

    this.employeeService.employees.subscribe({
      next: (employeeList) => {
        const availableStaff = employeeList.filter((emp) => emp.available);
        this.staffOptions = availableStaff.map((emp) => ({
          label: `${emp.name} - ${emp.role}`,
          value: emp.id,
        }));
      },
    });
  }

  assignRequest(req: svcRequest) {
    console.log(req)
    this.confirmationService.confirm({
      message: `Are you sure you want to assign this request?`,
      header: 'Confirm Assignment',
      accept: () => {
        this.isLoading = true;
        const payload = {
          requestId: req.id,
          employeeId: req.EmployeeID,
        };

        this.employeeService.assignServiceRequest(payload).subscribe({
          next: () => {
            this.employeeService.loadEmployee().subscribe();
            this.isLoading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Assigned',
              detail: 'Request successfully assigned.',
            });

            this.adminService.loadServiceRequest().subscribe({
              next: (res) => {
                this.requests.set(res.data);
              },
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Assignment failed.',
            });
            console.error('Assignment failed:', err);
          },
        });
      },
    });
  }

  countByStatus(status: string): number {
    return this.requests().filter((req) => req.status === status).length;
  }
}
