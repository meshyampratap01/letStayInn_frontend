import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Employee } from '../../../../service/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [DialogModule, FormsModule, DropdownModule,CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent {
  @Output() closeAddEmployee = new EventEmitter<any>();
  visible = true;

  employee: Employee = {
    name: '',
    email: '',
    password: '',
    role: '',
    available: true,
  };

  roleOptions = [
    { label: 'Kitchen Staff', value: 'KitchenStaff' },
    { label: 'Cleaning Staff', value: 'CleaningStaff' }
  ];

  closeDialog() {
    this.visible = false;
    this.closeAddEmployee.emit(undefined);
  }

  addEmployee() {
    if (
      this.employee.name &&
      this.employee.email &&
      this.employee.password.length >= 6 &&
      this.employee.role
    ) {
      this.closeAddEmployee.emit(this.employee);
      this.visible = false;
    }
  }
}