import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { getRoomResponse, room } from '../models/room';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { svcRequest, svcRequestResponse } from '../models/service_request';
import { employee, getEmployeeResponse } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  httpClient = inject(HttpClient);

  rooms = signal<room[] | null>(null);

  serviceRequests = signal<svcRequest[]>([])

  _pendingRequests = new BehaviorSubject<number>(0);

  _availableEmployee = new BehaviorSubject<number>(0);
  _unavailableEmployee = new BehaviorSubject<number>(0);

  employee = signal<employee[] | null>(null)

  constructor() {}


  loadServiceRequest() {
    const url = 'service-requests';
    return this.httpClient.get<svcRequestResponse>(url)
    .pipe(
      tap((res) => {
        let pending_svcRequest:number = 0;
        const svcRequests = res.data;
        this.serviceRequests.set(svcRequests)
        svcRequests.forEach((svcRequest) => {
          if (svcRequest.status === 'Pending') {
            pending_svcRequest = pending_svcRequest +1;
          }
        })
        this._pendingRequests.next(pending_svcRequest);
      })
    );
  }

  loadEmployee(){
    const url='employees';
    return this.httpClient.get<getEmployeeResponse>(url)
    .pipe(
      tap((res)=>{
        let availableEmployee = 0;
        let unavailableEmployee = 0;
        res.data.forEach((emp)=>{
          if(emp.available){
            availableEmployee++;
          }else{
            unavailableEmployee++;
          }
        })
        this._availableEmployee.next(availableEmployee);
        this._unavailableEmployee.next(unavailableEmployee);
        this.employee.set(res.data);
      })
    )
  }
}
