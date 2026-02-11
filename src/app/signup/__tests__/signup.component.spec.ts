import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from '../signup.component';
import { AuthService } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['signup']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    (routerMock as any).events = of();
    (routerMock as any).createUrlTree = () => ({});
    (routerMock as any).serializeUrl = () => '';
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have empty name on init', () => {
      expect(component.name).toBe('');
    });

    it('should have empty email on init', () => {
      expect(component.email).toBe('');
    });

    it('should have empty password on init', () => {
      expect(component.password).toBe('');
    });

    it('should have signupClicked as false initially', () => {
      expect(component.signupClicked()).toBe(false);
    });
  });

  describe('isSignupClicked method', () => {
    it('should return the value of signupClicked signal', () => {
      component.signupClicked.set(false);
      expect(component.isSignupClicked()).toBe(false);

      component.signupClicked.set(true);
      expect(component.isSignupClicked()).toBe(true);
    });
  });

  describe('signup method', () => {
    it('should not proceed if form is invalid', (done) => {
      const mockForm: any = {
        invalid: true,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(authServiceMock.signup).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should call authService.signup with correct credentials', (done) => {
      authServiceMock.signup.and.returnValue(
        of({ status_code: 201, message: 'Success', data: {} } as any)
      );

      component.name = 'John Doe';
      component.email = 'john@example.com';
      component.password = 'password123';

      const mockForm: any = { invalid: false, resetForm: jasmine.createSpy('resetForm') };
      component.signup(mockForm);

      setTimeout(() => {
        expect(authServiceMock.signup).toHaveBeenCalledWith(
          'John Doe',
          'john@example.com',
          'password123'
        );
        done();
      }, 100);
    });

    it('should set signupClicked to true when signup starts', (done) => {
      component.name = 'John';
      component.email = 'john@example.com';
      component.password = 'pass123';

      authServiceMock.signup.and.returnValue(
        of({ status_code: 201, message: 'Success', data: {} } as any)
      );

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(component.signupClicked()).toBe(false); // false after completion
        done();
      }, 100);
    });

    it('should reset form on successful signup', (done) => {
      authServiceMock.signup.and.returnValue(
        of({ status_code: 201, message: 'Success', data: {} } as any)
      );

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.name = 'Jane';
      component.email = 'jane@example.com';
      component.password = 'pass456';

      component.signup(mockForm);

      setTimeout(() => {
        expect(mockForm.resetForm).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should show success message on successful signup', (done) => {
      const successMessage = 'You have signed up successfully!';
      authServiceMock.signup.and.returnValue(
        of({
          status_code: 201,
          message: successMessage,
          data: {},
        } as any)
      );

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(messageServiceMock.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'success',
            summary: 'Signup Successful',
          })
        );
        done();
      }, 100);
    });

    it('should navigate to login on successful signup', (done) => {
      authServiceMock.signup.and.returnValue(
        of({ status_code: 201, message: 'Success', data: {} } as any)
      );

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }, 100);
    });

    it('should handle signup error', (done) => {
      const errorResponse = { error: { message: 'Email already exists' } };
      authServiceMock.signup.and.returnValue(throwError(() => errorResponse));

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(messageServiceMock.add).toHaveBeenCalled();
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should show error message on signup failure', (done) => {
      const error = { error: { message: 'Server error' } };
      authServiceMock.signup.and.returnValue(throwError(() => error));

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(messageServiceMock.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'error',
            summary: 'Signup Failed',
          })
        );
        done();
      }, 100);
    });

    it('should set signupClicked to false on error', (done) => {
      authServiceMock.signup.and.returnValue(
        throwError(() => ({ error: { message: 'Failed' } }))
      );

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(component.signupClicked()).toBe(false);
        done();
      }, 100);
    });

    it('should not reset form on error', (done) => {
      authServiceMock.signup.and.returnValue(
        throwError(() => ({ error: { message: 'Failed' } }))
      );

      const mockForm: any = {
        invalid: false,
        resetForm: jasmine.createSpy('resetForm'),
      };

      component.signup(mockForm);

      setTimeout(() => {
        expect(mockForm.resetForm).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });
});
