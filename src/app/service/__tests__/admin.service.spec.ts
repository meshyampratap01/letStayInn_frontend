import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from '../admin.service';
import { svcRequest } from '../../models/service_request';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const mockServiceRequests: svcRequest[] = [
    {
      id: '1',
      room_number: 101,
      request_type: 'Maintenance',
      description: 'Broken door',
      status: 'Pending',
    } as any,
    {
      id: '2',
      room_number: 102,
      request_type: 'Cleaning',
      description: 'Extra towels',
      status: 'Completed',
    } as any,
    {
      id: '3',
      room_number: 103,
      request_type: 'Maintenance',
      description: 'AC not working',
      status: 'Pending',
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have null rooms signals initially', () => {
      expect(service.rooms()).toBeNull();
    });

    it('should have null employee signals initially', () => {
      expect(service.employee()).toBeNull();
    });

    it('should have empty service requests initially', (done) => {
      service.serviceRequests.subscribe((requests) => {
        expect(requests.length).toBe(0);
        done();
      });
    });

    it('should have zero pending requests initially', (done) => {
      service._pendingRequests.subscribe((pending) => {
        expect(pending).toBe(0);
        done();
      });
    });
  });

  describe('loadServiceRequest', () => {
    it('should fetch service requests from API', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockServiceRequests,
      };

      service.loadServiceRequest().subscribe(() => {
        expect(service.serviceRequests.value).toEqual(mockServiceRequests);
        done();
      });

      const req = httpMock.expectOne('service-requests');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should update serviceRequests subject', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockServiceRequests,
      };

      service.loadServiceRequest().subscribe(() => {
        service.serviceRequests.subscribe((requests) => {
          expect(requests.length).toBe(3);
          done();
        });
      });

      const req = httpMock.expectOne('service-requests');
      req.flush(mockResponse);
    });

    it('should count pending requests correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockServiceRequests,
      };

      service.loadServiceRequest().subscribe(() => {
        service._pendingRequests.subscribe((pending) => {
          expect(pending).toBe(2); // 2 pending requests
          done();
        });
      });

      const req = httpMock.expectOne('service-requests');
      req.flush(mockResponse);
    });

    it('should handle empty service requests', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: [],
      };

      service.loadServiceRequest().subscribe(() => {
        expect(service.serviceRequests.value.length).toBe(0);
        service._pendingRequests.subscribe((pending) => {
          expect(pending).toBe(0);
          done();
        });
      });

      const req = httpMock.expectOne('service-requests');
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      service.loadServiceRequest().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('service-requests');
      req.error(new ErrorEvent('Server error'));
    });

    it('should only count Pending status requests', (done) => {
      const testRequests: svcRequest[] = [
        { id: '1', status: 'Pending' } as any,
        { id: '2', status: 'Pending' } as any,
        { id: '3', status: 'Completed' } as any,
        { id: '4', status: 'In Progress' } as any,
        { id: '5', status: 'Pending' } as any,
      ];

      const mockResponse = {
        code: 200,
        message: 'Success',
        data: testRequests,
      };

      service.loadServiceRequest().subscribe(() => {
        service._pendingRequests.subscribe((pending) => {
          expect(pending).toBe(3);
          done();
        });
      });

      const req = httpMock.expectOne('service-requests');
      req.flush(mockResponse);
    });
  });
});
