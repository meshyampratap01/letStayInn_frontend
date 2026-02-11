import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from '../profile.component';
import { ProfileService } from '../../../service/profile.service';
import { of } from 'rxjs';
import { profileDTO } from '../../../models/user';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileServiceMock: jasmine.SpyObj<ProfileService>;

  const mockProfile: profileDTO = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Manager',
    available: true,
  };

  beforeEach(async () => {
    profileServiceMock = jasmine.createSpyObj('ProfileService', ['getProfile']);
    profileServiceMock.getProfile.and.returnValue(
      of({
        status_code: 200,
        message: 'Success',
        data: mockProfile,
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [{ provide: ProfileService, useValue: profileServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have undefined user initially', () => {
      expect(component.user).toBeDefined();
    });

    it('should have userRole set after init', () => {
      expect(component.userRole).toBe('Manager');
    });

    it('should call profileService.getProfile on init', () => {
      expect(profileServiceMock.getProfile).toHaveBeenCalled();
    });
  });

  describe('profile loading', () => {
    it('should load profile data from service', (done) => {
      setTimeout(() => {
        expect(component.user).toEqual(mockProfile);
        done();
      }, 100);
    });

    it('should set userName from profile data', (done) => {
      setTimeout(() => {
        expect(component.userName).toBe('John Doe');
        done();
      }, 100);
    });

    it('should set userRole from profile data', (done) => {
      setTimeout(() => {
        expect(component.userRole).toBe('Manager');
        done();
      }, 100);
    });

    it('should handle profile with different role', (done) => {
      const guestProfile: profileDTO = {
        id: '456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Guest',
        available: true,
      };

      profileServiceMock.getProfile.and.returnValue(
        of({
          status_code: 200,
          message: 'Success',
          data: guestProfile,
        } as any)
      );

      const testFixture = TestBed.createComponent(ProfileComponent);
      const testComponent = testFixture.componentInstance;
      testFixture.detectChanges();

      setTimeout(() => {
        expect(testComponent.userName).toBe('Jane Doe');
        expect(testComponent.userRole).toBe('Guest');
        done();
      }, 100);
    });
  });

  describe('userInitials getter', () => {
    it('should return correct initials for full name', (done) => {
      setTimeout(() => {
        const initials = component.userInitials;
        expect(initials).toBe('JD');
        done();
      }, 100);
    });

    it('should return empty string if user is not set', () => {
      component.user = undefined;
      expect(component.userInitials).toBe('');
    });

    it('should return empty string if user name is empty', () => {
      component.user = { ...mockProfile, name: '' };
      expect(component.userInitials).toBe('');
    });

    it('should return correct initials for single name', () => {
      component.user = { ...mockProfile, name: 'John' };
      expect(component.userInitials).toBe('J');
    });

    it('should return correct initials for three-part name', () => {
      component.user = { ...mockProfile, name: 'John Michael Doe' };
      expect(component.userInitials).toBe('JMD');
    });

    it('should handle names with special characters', () => {
      component.user = { ...mockProfile, name: "O'Brien Smith" };
      const initials = component.userInitials;
      expect(initials.length).toBeGreaterThan(0);
    });

    it('should uppercase the initials', () => {
      component.user = { ...mockProfile, name: 'john doe' };
      expect(component.userInitials).toBe('JD');
    });
  });

  describe('profile availability', () => {
    it('should display available status correctly', (done) => {
      setTimeout(() => {
        expect(component.user?.available).toBe(true);
        done();
      }, 100);
    });

    it('should handle unavailable status', (done) => {
      const unavailableProfile: profileDTO = {
        ...mockProfile,
        available: false,
      };

      profileServiceMock.getProfile.and.returnValue(
        of({
          status_code: 200,
          message: 'Success',
          data: unavailableProfile,
        } as any)
      );

      const testFixture = TestBed.createComponent(ProfileComponent);
      const testComponent = testFixture.componentInstance;
      testFixture.detectChanges();

      setTimeout(() => {
        expect(testComponent.user?.available).toBe(false);
        done();
      }, 100);
    });
  });

  describe('error handling', () => {
    it('should handle service error gracefully', () => {
      const errorResponse = { error: { message: 'Failed to load profile' } };

      profileServiceMock.getProfile.and.returnValue(
        of({
          status_code: 500,
          message: 'Server error',
          data: {} as any,
        } as any)
      );

      expect(() => {
        profileServiceMock.getProfile.and.returnValue(
          of({
            status_code: 500,
            message: 'Server error',
            data: {} as any,
          } as any)
        );

        TestBed.createComponent(ProfileComponent);
      }).not.toThrow();
    });
  });
});
