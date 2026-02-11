import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from '../auth.guard';
import { AuthService } from '../../service/auth.service';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isloggedin']);
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow activation if user is logged in', () => {
    authServiceMock.isloggedin.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('should deny activation if user is not logged in', () => {
    authServiceMock.isloggedin.and.returnValue(false);
    routerMock.createUrlTree.and.returnValue({} as any);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBeTruthy();
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login when not authenticated', () => {
    authServiceMock.isloggedin.and.returnValue(false);
    routerMock.createUrlTree.and.returnValue({ toString: () => '/login' } as any);

    TestBed.runInInjectionContext(() => {
      authGuard({} as any, {} as any);
    });

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should call isloggedin method on AuthService', () => {
    authServiceMock.isloggedin.and.returnValue(true);

    TestBed.runInInjectionContext(() => {
      authGuard({} as any, {} as any);
    });

    expect(authServiceMock.isloggedin).toHaveBeenCalled();
  });

  it('should handle multiple guard checks', () => {
    authServiceMock.isloggedin.and.returnValue(true);

    TestBed.runInInjectionContext(() => {
      const result1 = authGuard({} as any, {} as any);
      const result2 = authGuard({} as any, {} as any);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    expect(authServiceMock.isloggedin).toHaveBeenCalledTimes(2);
  });
});
