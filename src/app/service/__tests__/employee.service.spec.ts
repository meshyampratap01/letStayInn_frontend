import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from '../employee.service';
import { employee } from '../../models/employee';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const mockEmployees: employee[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Manager',
      available: true,
    } as any,
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Kitchen Staff',
      available: false,
    } as any,
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'Cleaning Staff',
      available: true,
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty employees initially', (done) => {
      service.employees.subscribe((employees) => {
        expect(employees.length).toBe(0);
        done();
      });
    });

    it('should have zero available employees initially', (done) => {
      service._availableEmployee.subscribe((available) => {
        expect(available).toBe(0);
        done();
      });
    });

    it('should have zero unavailable employees initially', (done) => {
      service._unavailableEmployee.subscribe((unavailable) => {
        expect(unavailable).toBe(0);
        done();
      });
    });

    it('should have empty assigned service requests initially', (done) => {
      service._assignedServiceReqeust.subscribe((requests) => {
        expect(requests.length).toBe(0);
        done();
      });
    });
  });

  describe('loadEmployee', () => {
    it('should fetch employees from API', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockEmployees,
      };

      service.loadEmployee().subscribe(() => {
        expect(service.employees.value).toEqual(mockEmployees);
        done();
      });

      const req = httpMock.expectOne('employees');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should count available employees correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockEmployees,
      };

      service.loadEmployee().subscribe(() => {
        service._availableEmployee.subscribe((available) => {
          expect(available).toBe(2); // John and Bob are available
          done();
        });
      });

      const req = httpMock.expectOne('employees');
      req.flush(mockResponse);
    });

    it('should count unavailable employees correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockEmployees,
      };

      service.loadEmployee().subscribe(() => {
        service._unavailableEmployee.subscribe((unavailable) => {
          expect(unavailable).toBe(1); // Jane is unavailable
          done();
        });
      });

      const req = httpMock.expectOne('employees');
      req.flush(mockResponse);
    });

    it('should handle empty employee list', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: [],
      };

      service.loadEmployee().subscribe(() => {
        expect(service.employees.value.length).toBe(0);
        service._availableEmployee.subscribe((available) => {
          expect(available).toBe(0);
          done();
        });
      });

      const req = httpMock.expectOne('employees');
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      service.loadEmployee().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('employees');
      req.error(new ErrorEvent('Server error'));
    });

    it('should correctly identify all employees as available', (done) => {
      const allAvailable: employee[] = [
        { name: 'Emp1', available: true } as any,
        { name: 'Emp2', available: true } as any,
        { name: 'Emp3', available: true } as any,
      ];

      const mockResponse = {
        code: 200,
        message: 'Success',
        data: allAvailable,
      };

      service.loadEmployee().subscribe(() => {
        service._availableEmployee.subscribe((available) => {
          expect(available).toBe(3);
          service._unavailableEmployee.subscribe((unavailable) => {
            expect(unavailable).toBe(0);
            done();
          });
        });
      });

      const req = httpMock.expectOne('employees');
      req.flush(mockResponse);
    });

    it('should correctly identify all employees as unavailable', (done) => {
      const allUnavailable: employee[] = [
        { name: 'Emp1', available: false } as any,
        { name: 'Emp2', available: false } as any,
      ];

      const mockResponse = {
        code: 200,
        message: 'Success',
        data: allUnavailable,
      };

      service.loadEmployee().subscribe(() => {
        service._availableEmployee.subscribe((available) => {
          expect(available).toBe(0);
          service._unavailableEmployee.subscribe((unavailable) => {
            expect(unavailable).toBe(2);
            done();
          });
        });
      });

      const req = httpMock.expectOne('employees');
      req.flush(mockResponse);
    });
  });
});
