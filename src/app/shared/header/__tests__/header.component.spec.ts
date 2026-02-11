import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from '../header.component';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have required inputs', () => {
      expect(() => {
        component = TestBed.createComponent(HeaderComponent).componentInstance;
      }).not.toThrow();
    });
  });

  describe('logout method', () => {
    it('should remove user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'John' }));
      component.logout();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should remove token from localStorage', () => {
      localStorage.setItem('token', JSON.stringify('token-value'));
      component.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should navigate to login page', () => {
      component.logout();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should clear both user and token on logout', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'John' }));
      localStorage.setItem('token', JSON.stringify('token-value'));

      component.logout();

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle logout when no data in localStorage', () => {
      localStorage.clear();
      expect(() => {
        component.logout();
      }).not.toThrow();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('goToProfile method', () => {
    it('should navigate to profile page', () => {
      component.goToProfile();
      expect(routerMock.navigate).toHaveBeenCalledWith(['profile']);
    });

    it('should only navigate to profile, not logout', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'John' }));
      localStorage.setItem('token', JSON.stringify('token-value'));

      component.goToProfile();

      expect(localStorage.getItem('user')).not.toBeNull();
      expect(localStorage.getItem('token')).not.toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['profile']);
    });
  });

  describe('input signals', () => {
    it('should have required userName input', () => {
      expect(component.userName).toBeDefined();
    });

    it('should have required userRole input', () => {
      expect(component.userRole).toBeDefined();
    });

    it('should have default values for inputs', () => {
      // These are required inputs, so they should be set by parent
      // Testing that the component accepts them
      const testFixture = TestBed.createComponent(HeaderComponent);
      expect(testFixture.componentInstance).toBeTruthy();
    });
  });
});
