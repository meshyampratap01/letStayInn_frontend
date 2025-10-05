import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Employee, EmployeeService } from '../../../service/employee.service';
import { AdminService } from '../../../service/admin.service';
import { employee } from '../../../models/employee';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
  selector: 'app-employee',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    AddEmployeeComponent,
    ProgressSpinnerModule,
    Toast,
    DialogModule,
    DropdownModule,
    FormsModule,
    ConfirmDialog
],
  providers: [MessageService,ConfirmationService],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  adminSvc = inject(AdminService);
  // employeeService = inject(EmployeeService);
  employeeService = inject(EmployeeService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  employees: employee[] = [];

  visible = false;

  isLoading = false;

  viewAddEmployeeDialog = false;

  employeeToEdit: employee = {
    name: '',
    email: '',
    id: '',
    role: '',
    available: true,
  };

  availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false },
  ];

  constructor() {
    this.employeeService.employees.subscribe({
      next: (val) => {
        this.employees = val;
      },
    });
  }

  // ngOnInit(): void {
  //   this.adminSvc.loadServiceRequest().subscribe()
  // }

  onClickAddEmployee() {
    this.viewAddEmployeeDialog = true;
  }

  onCloseAddEmployee(event: Employee | undefined) {
    if (event == undefined) {
      this.viewAddEmployeeDialog = false;
    } else {
      this.isLoading = true;
      this.employeeService.addEmployee(event).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            closable: true,
            summary: 'Added Employee Successfully!',
            detail: res.message,
            life: 4000,
          });
          this.viewAddEmployeeDialog = false;
          this.employeeService.loadEmployee().subscribe();
        },
        error: (res) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Some error Occured!',
            detail: res.message,
            life: 3000,
          });
        },
      });
    }
  }

  onSelectEditEmployee(employee: employee) {
    this.visible = true;
    this.employeeToEdit = employee;
  }

  onCancelUpdateEmployee() {
    this.visible = false;
    this.employeeService.loadEmployee().subscribe();
  }

  updateEmployee() {
    this.isLoading = true;
    this.employeeService.updateEmployee(this.employeeToEdit).subscribe({
      next: (res) => {
        this.employeeService.loadEmployee().subscribe();
        this.isLoading = false;
        this.messageService.add({
          severity: 'info',
          summary: `${this.employeeToEdit.name}'s availability updated!`,
          detail: res.message,
        });
        this.visible = false;
      },
      error: (res) => {
        this.employeeService.loadEmployee().subscribe();
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Some error Occured!',
          detail: res.message,
          life: 3000,
        });
        this.visible = false;
      },
    });
  }

  onSelectDeleteEmployee(event:Event,employee: employee){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Remove ${employee.name} as an employee?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Yes',
      },
      accept: () => {
        this.isLoading = true;
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: (res) => {
            this.employeeService.loadEmployee().subscribe();
            this.isLoading = false;
            this.messageService.add({
              severity: 'info',
              summary: `${employee.name} removed!`,
              detail: res.message,
            });
          },
          error: (res) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Some error Occured!',
              detail: res.message,
              life: 3000,
            });
          },
        });
      },
      reject: () => {},
    });
  }
}
