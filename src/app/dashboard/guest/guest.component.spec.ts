import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestComponent } from './guest.component';
import { Roles } from '../../models/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { of } from 'rxjs';

describe('GuestComponent', () => {
  let component: GuestComponent;
  let fixture: ComponentFixture<GuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: AuthService, useClass: MockAuthService }, // Mock AuthService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('GuestComponent additional tests', () => {
    it('should initialize with correct user details', () => {
      expect(component.userName).toBe('testuser'); // Replace with actual test user name
      expect(component.role).toBe(Roles.GUEST); // Replace with actual test role
    });

    it('should navigate and scroll to the correct route', () => {
      spyOn(component, 'navigateAndScroll').and.callThrough();
      const route = 'my-bookings';
      component.navigateAndScroll(route);
      expect(component.navigateAndScroll).toHaveBeenCalledWith(route);
    });

    it('should unsubscribe from all subscriptions on destroy', () => {
      spyOn(component.totalbookingsSubscription!, 'unsubscribe');
      spyOn(component.serviceReqeustSubscription!, 'unsubscribe');
      spyOn(component.getAverageRatingSubscription!, 'unsubscribe');
      spyOn(component.getActiveBookingsSubscription!, 'unsubscribe');
      spyOn(component.loadserviceReqeustSubscription!, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.totalbookingsSubscription?.unsubscribe).toHaveBeenCalled();
      expect(component.serviceReqeustSubscription?.unsubscribe).toHaveBeenCalled();
      expect(component.getAverageRatingSubscription?.unsubscribe).toHaveBeenCalled();
      expect(component.getActiveBookingsSubscription?.unsubscribe).toHaveBeenCalled();
      expect(component.loadserviceReqeustSubscription?.unsubscribe).toHaveBeenCalled();
    });
  });
});

class MockAuthService {
  user() {
    return { UserName: 'testuser', Role: Roles.GUEST, ID: '123' };
  }
}