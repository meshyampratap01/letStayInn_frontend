import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeedbackService } from '../feedback.service';
import { feedback } from '../../models/feedback';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpMock: HttpTestingController;

  const mockFeedbacks: feedback[] = [
    {
      id: '1',
      rating: 5,
      comment: 'Excellent service',
      guest_name: 'John Doe',
      date: '2024-02-01',
    } as any,
    {
      id: '2',
      rating: 4,
      comment: 'Good experience',
      guest_name: 'Jane Doe',
      date: '2024-02-02',
    } as any,
    {
      id: '3',
      rating: 3,
      comment: 'Average service',
      guest_name: 'Bob Smith',
      date: '2024-02-03',
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeedbackService],
    });
    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have zero average rating initially', () => {
      expect(service.avgRating()).toBe(0);
    });

    it('should have empty feedbacks initially', () => {
      expect(service.feedbacks().length).toBe(0);
    });

    it('should have zero total feedbacks initially', () => {
      expect(service.totalFeedbacks()).toBe(0);
    });
  });

  describe('getAverageRating', () => {
    it('should calculate average rating correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockFeedbacks,
      };

      service.getAverageRating().subscribe((avg) => {
        expect(avg).toBe(4); // (5+4+3)/3 = 4
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return 0 for empty feedbacks', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: [],
      };

      service.getAverageRating().subscribe((avg) => {
        expect(avg).toBe(0);
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      req.flush(mockResponse);
    });

    it('should update feedbacks signal', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockFeedbacks,
      };

      service.getAverageRating().subscribe(() => {
        expect(service.feedbacks()).toEqual(mockFeedbacks);
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      req.flush(mockResponse);
    });

    it('should update totalFeedbacks signal', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockFeedbacks,
      };

      service.getAverageRating().subscribe(() => {
        expect(service.totalFeedbacks()).toBe(3);
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      req.flush(mockResponse);
    });

    it('should handle single feedback', (done) => {
      const singleFeedback: feedback[] = [
        { id: '1', rating: 5, comment: 'Perfect' } as any,
      ];

      const mockResponse = {
        code: 200,
        message: 'Success',
        data: singleFeedback,
      };

      service.getAverageRating().subscribe((avg) => {
        expect(avg).toBe(5);
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      service.getAverageRating().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('feedbacks');
      req.error(new ErrorEvent('Server error'));
    });

    it('should calculate correct average with decimal ratings', (done) => {
      const testFeedbacks: feedback[] = [
        { rating: 5 } as any,
        { rating: 4 } as any,
        { rating: 5 } as any,
      ];

      const mockResponse = {
        code: 200,
        message: 'Success',
        data: testFeedbacks,
      };

      service.getAverageRating().subscribe((avg) => {
        expect(avg).toBeCloseTo(4.67, 2);
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      req.flush(mockResponse);
    });
  });

  describe('submitFeedback', () => {
    it('should submit feedback', (done) => {
      const newFeedback: feedback = {
        rating: 5,
        comment: 'Great!',
        guest_name: 'New Guest',
      } as any;

      const mockResponse = {
        code: 201,
        message: 'Feedback submitted',
        data: {},
      };

      service.submitFeedback(newFeedback).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('feedbacks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newFeedback);
      req.flush(mockResponse);
    });

    it('should handle submission error', (done) => {
      const newFeedback: feedback = {
        rating: 5,
        comment: 'Great!',
      } as any;

      service.submitFeedback(newFeedback).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('feedbacks');
      req.error(new ErrorEvent('Submission failed'));
    });
  });
});
