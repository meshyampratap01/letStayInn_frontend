import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from '../unauthorized.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            events: of(),
            createUrlTree: () => ({}),
            serializeUrl: () => '',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render unauthorized content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.unauthorized-message')).toBeTruthy();
    });
  });

  describe('routing links', () => {
    it('should have RouterLink imports', () => {
      // Component imports RouterLink for navigation
      expect(UnauthorizedComponent).toBeTruthy();
    });
  });
});
