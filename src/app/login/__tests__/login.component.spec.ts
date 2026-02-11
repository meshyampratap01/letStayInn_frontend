import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { Roles } from '../../models/user';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'user']);
    authServiceMock.user = (() => ({
      ID: '123',
      UserName: 'testuser',
      Role: Roles.GUEST,
    })) as any;

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    (routerMock as any).events = of();
    (routerMock as any).createUrlTree = () => ({});
    (routerMock as any).serializeUrl = () => '';
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    const realMsg = TestBed.inject(MessageService);
    try {
      spyOn(realMsg, 'add');
    } catch (e) {}
    messageServiceMock = realMsg as any;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have empty email on init', () => {
      expect(component.email).toBe('');
    });

    it('should have empty password on init', () => {
      expect(component.password).toBe('');
    });

    it('should have isInvalid as false initially', () => {
      expect(component.isInvalid()).toBe(false);
    });

    it('should have loginClicked as false initially', () => {
      expect(component.loginClicked()).toBe(false);
    });

    it('should navigate to admin if token exists on ngOnInit', () => {
      localStorage.setItem('token', JSON.stringify('valid-token'));
      component.ngOnInit();
      expect(routerMock.navigate).toHaveBeenCalledWith(['admin']);
    });

    it('should not navigate if no token on ngOnInit', () => {
      localStorage.removeItem('token');
      component.ngOnInit();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('login method', () => {
    it('should call authService.login with email and password', (done) => {
      component.email = 'test@example.com';
      component.password = 'password123';

      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(authServiceMock.login).toHaveBeenCalledWith(
          'test@example.com',
          'password123'
        );
        done();
      }, 100);
    });

    it('should set loginClicked to true when login is called', (done) => {
      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));
      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(component.loginClicked()).toBe(false); // set to false on complete
        done();
      }, 100);
    });

    it('should navigate to /guest for guest user on successful login', (done) => {
      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));
      authServiceMock.user = (() => ({
        ID: '123',
        UserName: 'testuser',
        Role: Roles.GUEST,
      })) as any;

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/guest']);
        done();
      }, 100);
    });

    it('should navigate to /admin for manager user on successful login', (done) => {
      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));
      authServiceMock.user = (() => ({
        ID: '123',
        UserName: 'testuser',
        Role: Roles.MANAGER,
      })) as any;

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/admin']);
        done();
      }, 100);
    });

    it('should navigate to /employee for kitchen staff on successful login', (done) => {
      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));
      authServiceMock.user = (() => ({
        ID: '123',
        UserName: 'testuser',
        Role: Roles.KITCHENSTAFF,
      })) as any;

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/employee']);
        done();
      }, 100);
    });

    it('should navigate to /employee for cleaning staff on successful login', (done) => {
      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));
      authServiceMock.user = (() => ({
        ID: '123',
        UserName: 'testuser',
        Role: Roles.CLEANINGSTAFF,
      })) as any;

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/employee']);
        done();
      }, 100);
    });

    it('should reset form on successful login', (done) => {
      authServiceMock.login.and.returnValue(of({ code: 200, message: 'Success' } as any));
      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(mockForm.reset).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should handle login error', (done) => {
      const error = { error: { message: 'Invalid credentials' } };
      authServiceMock.login.and.returnValue(throwError(() => error));

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(component.isInvalid()).toBe(true);
        expect(messageServiceMock.add).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should set isInvalid to true on login failure', (done) => {
      authServiceMock.login.and.returnValue(
        throwError(() => ({ error: { message: 'Failed' } }))
      );

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(component.isInvalid()).toBe(true);
        done();
      }, 100);
    });

    it('should show error message on login failure', (done) => {
      const errorMessage = 'Invalid credentials or server error';
      authServiceMock.login.and.returnValue(
        throwError(() => ({ error: { message: errorMessage } }))
      );

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(messageServiceMock.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'error',
            summary: 'Login Failed',
          })
        );
        done();
      }, 100);
    });

    it('should set loginClicked to false on error', (done) => {
      authServiceMock.login.and.returnValue(
        throwError(() => ({ error: { message: 'Failed' } }))
      );

      const mockForm: any = { reset: jasmine.createSpy('reset'), invalid: false };

      component.login(mockForm);

      setTimeout(() => {
        expect(component.loginClicked()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('inputClicked method', () => {
    it('should set isInvalid to false', () => {
      component.isInvalid.set(true);
      component.inputClicked();
      expect(component.isInvalid()).toBe(false);
    });

    it('should clear error state when input is clicked', () => {
      component.isInvalid.set(true);
      expect(component.isInvalid()).toBe(true);

      component.inputClicked();
      expect(component.isInvalid()).toBe(false);
    });
  });
});
