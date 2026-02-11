import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { Roles } from '../../models/user';
import { loginResponse } from '../../models/login';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJKb2huIiwicm9sZSI6Ik1hbmFnZXIifQ.signature';
  const mockUser = {
    ID: '123',
    UserName: 'John',
    Role: Roles.MANAGER,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load user from localStorage on init', () => {
      const user = { ID: '123', UserName: 'Test', Role: Roles.GUEST };
      localStorage.setItem('user', JSON.stringify(user));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService],
      });

      const newService = TestBed.inject(AuthService);
      expect(newService.user()).toEqual(user);
    });

    it('should set user signal to null if no user in localStorage', () => {
      expect(service.user()).toBeNull();
    });
  });

  describe('login', () => {
    it('should call login endpoint and update user signal', (done) => {
      const mockResponse: loginResponse = {
        code: 200,
        message: 'Success',
        data: { token: mockToken },
      };

      service.login('test@example.com', 'password').subscribe(() => {
        expect(service.user()).toEqual(mockUser);
        expect(localStorage.getItem('token')).toBeDefined();
        expect(localStorage.getItem('user')).toBeDefined();
        done();
      });

      const req = httpMock.expectOne('auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password',
      });
      req.flush(mockResponse);
    });

    it('should save token and user to localStorage', (done) => {
      const mockResponse: loginResponse = {
        code: 200,
        message: 'Success',
        data: { token: mockToken },
      };

      service.login('test@example.com', 'password').subscribe(() => {
        const storedToken = JSON.parse(localStorage.getItem('token') || '{}');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        expect(storedToken).toEqual(mockToken);
        expect(storedUser).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne('auth/login');
      req.flush(mockResponse);
    });

    it('should handle login error', (done) => {
      service.login('invalid@example.com', 'wrong').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('auth/login');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('signup', () => {
    it('should call signup endpoint', (done) => {
      const mockResponse = {
        code: 201,
        message: 'User created successfully',
        data: {},
      };

      service.signup('John Doe', 'john@example.com', 'password123').subscribe((response) => {
        expect(response.message).toBe('User created successfully');
        done();
      });

      const req = httpMock.expectOne('auth/signup');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      req.flush(mockResponse);
    });

    it('should handle signup error', (done) => {
      service.signup('John', 'john@example.com', 'pass').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('auth/signup');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('isloggedin', () => {
    it('should return true if user exists in localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      expect(service.isloggedin()).toBe(true);
    });

    it('should return false if user not in localStorage', () => {
      localStorage.removeItem('user');
      expect(service.isloggedin()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true if user has MANAGER role', () => {
      localStorage.setItem('token', JSON.stringify(mockToken));
      expect(service.isAdmin()).toBe(true);
    });

    it('should return false if user is not a manager', (done) => {
      const guestToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJKb2huIiwicm9sZSI6Ikd1ZXN0In0.signature';
      localStorage.setItem('token', JSON.stringify(guestToken));
      
      // This will fail to decode and return invalid role, so isAdmin returns false
      const result = service.isAdmin();
      expect(result).toBe(false);
      done();
    });

    it('should handle invalid token gracefully', () => {
      localStorage.setItem('token', JSON.stringify('invalid-token'));
      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('decodeJWT (private method via login)', () => {
    it('should decode token with Manager role correctly', (done) => {
      const mockResponse: loginResponse = {
        code: 200,
        message: 'Success',
        data: { token: mockToken },
      };

      service.login('test@example.com', 'password').subscribe(() => {
        expect(service.user()?.Role).toBe(Roles.MANAGER);
        done();
      });

      const req = httpMock.expectOne('auth/login');
      req.flush(mockResponse);
    });

    it('should decode token with KitchenStaff role correctly', (done) => {
      const kitchenToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjM0IiwidXNlcm5hbWUiOiJKYW5lIiwicm9sZSI6IktpdGNoZW5TdGFmZiJ9.signature';
      const mockResponse: loginResponse = {
        code: 200,
        message: 'Success',
        data: { token: kitchenToken },
      };

      service.login('test@example.com', 'password').subscribe(() => {
        expect(service.user()?.Role).toBe(Roles.KITCHENSTAFF);
        done();
      });

      const req = httpMock.expectOne('auth/login');
      req.flush(mockResponse);
    });

    it('should decode token with CleaningStaff role correctly', (done) => {
      const cleaningToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMzQ1IiwidXNlcm5hbWUiOiJCb2IiLCJyb2xlIjoiQ2xlYW5pbmdTdGFmZiJ9.signature';
      const mockResponse: loginResponse = {
        code: 200,
        message: 'Success',
        data: { token: cleaningToken },
      };

      service.login('test@example.com', 'password').subscribe(() => {
        expect(service.user()?.Role).toBe(Roles.CLEANINGSTAFF);
        done();
      });

      const req = httpMock.expectOne('auth/login');
      req.flush(mockResponse);
    });

    it('should decode token with Guest role correctly', (done) => {
      const guestToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDU2IiwidXNlcm5hbWUiOiJBbGljZSIsInJvbGUiOiJHdWVzdCJ9.signature';
      const mockResponse: loginResponse = {
        code: 200,
        message: 'Success',
        data: { token: guestToken },
      };

      service.login('test@example.com', 'password').subscribe(() => {
        expect(service.user()?.Role).toBe(Roles.GUEST);
        done();
      });

      const req = httpMock.expectOne('auth/login');
      req.flush(mockResponse);
    });
  });
});
