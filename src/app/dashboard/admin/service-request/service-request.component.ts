import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DropdownItem, DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../../service/admin.service';
import { svcRequest } from '../../../models/service_request';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-request',
  imports: [CommonModule, TableModule, DropdownModule, FormsModule, DatePipe],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss',
})
export class ServiceRequestComponent {
  adminService = inject(AdminService);
  requests = signal<svcRequest[]>([]);
  staffOptions = [
      { label: 'John Smith - Housekeeper', value: 'John Smith' },
      { label: 'Sarah Johnson - Chef', value: 'Sarah Johnson' },
      { label: 'Mike Wilson - Room Service', value: 'Mike Wilson' },
      { label: 'Emma Davis - Housekeeper', value: 'Emma Davis' },
      { label: 'David Brown - Waiter', value: 'David Brown' },
      { label: 'Lisa Garcia - Receptionist', value: 'Lisa Garcia' },
    ];

  constructor() {
    this.adminService.loadServiceRequest().subscribe({
      next: (res) => {
        this.requests.set(res.data);
      },
    });
  }

  assignRequest(req: svcRequest) {}
}
