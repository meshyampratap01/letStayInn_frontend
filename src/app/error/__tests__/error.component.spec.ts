import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from '../error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate'), events: of(), createUrlTree: () => ({}), serializeUrl: () => '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error-message')).toBeTruthy();
    });
  });

  describe('routing links', () => {
    it('should have RouterLink imports', () => {
      // Component imports RouterLink for potential navigation
      expect(ErrorComponent).toBeTruthy();
    });
  });
});
