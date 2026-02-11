import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from '../admin.guard';
import { AuthService } from '../../service/auth.service';

// Helper function to create a valid JWT token with expiry
function createMockToken(expiryTime: number = Math.floor(Date.now() / 1000) + 3600): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ user_id: '123', username: 'admin', role: 'Manager', exp: expiryTime })
  );
  return `${header}.${payload}.signature`;
}

describe('adminGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAdmin']);
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate']);
    routerMock.createUrlTree.and.returnValue({} as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('authentication check', () => {
    it('should allow activation if user is admin with valid token', () => {
      const mockToken = createMockToken();
      localStorage.setItem('token', JSON.stringify(mockToken));
      authServiceMock.isAdmin.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(true);
    });

    it('should deny activation if user is not admin', () => {
      const mockToken = createMockToken();
      localStorage.setItem('token', JSON.stringify(mockToken));
      authServiceMock.isAdmin.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() =>
        adminGuard({} as any, {} as any)
      );

      expect(result).toBeTruthy();
      expect(routerMock.createUrlTree).toHaveBeenCalled();
    });

    it('should redirect to login if no token is present', () => {
      localStorage.removeItem('token');

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('token expiry check', () => {
    it('should allow access with valid non-expired token', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const mockToken = createMockToken(futureTime);
      localStorage.setItem('token', JSON.stringify(mockToken));
      authServiceMock.isAdmin.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(true);
    });

    it('should deny access with expired token', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const mockToken = createMockToken(pastTime);
      localStorage.setItem('token', JSON.stringify(mockToken));

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle invalid token format', () => {
      localStorage.setItem('token', JSON.stringify('invalid-token-format'));

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('localStorage cleanup', () => {
    it('should clear user and token from localStorage on expired token', () => {
      localStorage.setItem('user', JSON.stringify({ id: '123' }));
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const mockToken = createMockToken(pastTime);
      localStorage.setItem('token', JSON.stringify(mockToken));

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should clear user and token when no token exists', () => {
      localStorage.setItem('user', JSON.stringify({ id: '123' }));
      localStorage.setItem('token', JSON.stringify('some-token'));
      localStorage.removeItem('token');

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle malformed JWT gracefully', () => {
      const malformedToken = 'not.a.valid.token.format';
      localStorage.setItem('token', JSON.stringify(malformedToken));

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle null token value', () => {
      localStorage.setItem('token', 'null');

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('alert display', () => {
    it('should show alert when session expired', () => {
      spyOn(window, 'alert');
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const mockToken = createMockToken(pastTime);
      localStorage.setItem('token', JSON.stringify(mockToken));

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(window.alert).toHaveBeenCalledWith('Your session has expired. Please log in again.');
    });

    it('should show alert when no token present', () => {
      spyOn(window, 'alert');
      localStorage.removeItem('token');

      TestBed.runInInjectionContext(() => {
        adminGuard({} as any, {} as any);
      });

      expect(window.alert).toHaveBeenCalledWith('Your session has expired. Please log in again.');
    });
  });
});
