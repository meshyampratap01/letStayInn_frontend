import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { employee } from '../models/employee';
import { response } from '../models/response';
import { BehaviorSubject, tap } from 'rxjs';

export type Employee = {
  name: string;
  email: string;
  password: string;
  role: string;
  available: true;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private httpClient = inject(HttpClient);

  employees = new BehaviorSubject<employee[]>([]);
  _availableEmployee = new BehaviorSubject<number>(0);
  _unavailableEmployee = new BehaviorSubject<number>(0);


  constructor() { }

  loadEmployee(){
    const url='employees';
    return this.httpClient.get<response>(url)
    .pipe(
      tap((res)=>{
        let availableEmployee = 0;
        let unavailableEmployee = 0;
        res.data.forEach((emp:employee)=>{
          if(emp.available){
            availableEmployee++;
          }else{
            unavailableEmployee++;
          }
        })
        this._availableEmployee.next(availableEmployee);
        this._unavailableEmployee.next(unavailableEmployee);
        this.employees.next(res.data);
      })
    )
  }

  addEmployee(newEmployee: Employee){
    const url = 'employees';
    return this.httpClient.post<response>(url,newEmployee);
  }

  updateEmployee(emp: employee){
    const url = `employees/${emp.email}/availability`;
    return this.httpClient.put<response>(url,{
      available: emp.available
    })
  }

  deleteEmployee(empId: string){
    const url = `employees/${empId}`;
    return this.httpClient.delete<response>(url)
  }

  assignServiceRequest(payload: {requestId: string, employeeId: string}){
    const url = `service-requests/${payload.requestId}/assign`;
    return this.httpClient.post(url,{employee_id:payload.employeeId});
  }

}
