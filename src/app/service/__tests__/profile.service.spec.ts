import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from '../profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService],
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty userName initially', (done) => {
      service.userName.subscribe((name) => {
        expect(name).toBe('');
        done();
      });
    });

    it('should have empty userRole initially', (done) => {
      service.userRole.subscribe((role) => {
        expect(role).toBe('');
        done();
      });
    });
  });

  describe('getProfile', () => {
    it('should fetch user profile from API', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          name: 'John Doe',
          role: 'Manager',
          email: 'john@example.com',
          id: '123',
        },
      };

      service.getProfile().subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('profile');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should update userName subject', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          name: 'Jane Doe',
          role: 'Guest',
        },
      };

      service.getProfile().subscribe(() => {
        service.userName.subscribe((name) => {
          expect(name).toBe('Jane Doe');
          done();
        });
      });

      const req = httpMock.expectOne('profile');
      req.flush(mockResponse);
    });

    it('should update userRole subject', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          name: 'Bob Smith',
          role: 'Kitchen Staff',
        },
      };

      service.getProfile().subscribe(() => {
        service.userRole.subscribe((role) => {
          expect(role).toBe('Kitchen Staff');
          done();
        });
      });

      const req = httpMock.expectOne('profile');
      req.flush(mockResponse);
    });

    it('should update both subjects correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          name: 'Alice Johnson',
          role: 'Cleaning Staff',
        },
      };

      service.getProfile().subscribe(() => {
        let userNameUpdated = false;
        let userRoleUpdated = false;

        service.userName.subscribe((name) => {
          if (name === 'Alice Johnson') userNameUpdated = true;
          if (userNameUpdated && userRoleUpdated) {
            done();
          }
        });

        service.userRole.subscribe((role) => {
          if (role === 'Cleaning Staff') userRoleUpdated = true;
          if (userNameUpdated && userRoleUpdated) {
            done();
          }
        });
      });

      const req = httpMock.expectOne('profile');
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      service.getProfile().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('profile');
      req.error(new ErrorEvent('Server error'));
    });

    it('should handle profile with empty name', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: {
          name: '',
          role: 'Guest',
        },
      };

      service.getProfile().subscribe(() => {
        service.userName.subscribe((name) => {
          expect(name).toBe('');
          done();
        });
      });

      const req = httpMock.expectOne('profile');
      req.flush(mockResponse);
    });
  });
});
