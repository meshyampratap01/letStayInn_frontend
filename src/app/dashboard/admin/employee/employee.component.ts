import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { EmployeeService } from '../../../service/employee.service';
import { AdminService } from '../../../service/admin.service';
import { employee } from '../../../models/employee';

@Component({
  selector: 'app-employee',
  imports: [CommonModule,TableModule,ButtonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  adminSvc = inject(AdminService)
  employees = signal<employee[]>([]);

  constructor() {
    this.adminSvc.loadEmployee().subscribe({
      next: (res)=>{
        this.employees.set(res.data)
      }
    })

  }

  // ngOnInit(): void {
  //   this.adminSvc.loadServiceRequest().subscribe()
  // }
}
