import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from '../booking.service';
import { BookingDTO } from '../../models/bookings';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  const mockBookings: BookingDTO[] = [
    {
      id: '1',
      room_number: 101,
      guest_name: 'John Doe',
      check_in_date: '2024-02-15',
      check_out_date: '2024-02-20',
    } as any,
    {
      id: '2',
      room_number: 102,
      guest_name: 'Jane Doe',
      check_in_date: '2024-02-16',
      check_out_date: '2024-02-21',
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService],
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty bookings initially', (done) => {
      service.activeBookings.subscribe((bookings) => {
        expect(bookings.length).toBe(0);
        done();
      });
    });

    it('should have zero total bookings initially', (done) => {
      service.totalActiveBookings.subscribe((total) => {
        expect(total).toBe(0);
        done();
      });
    });
  });

  describe('getActiveBookings', () => {
    it('should fetch active bookings from API', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockBookings,
      };

      service.getActiveBookings().subscribe(() => {
        expect(service.activeBookings.value).toEqual(mockBookings);
        expect(service.totalActiveBookings.value).toBe(2);
        done();
      });

      const req = httpMock.expectOne('bookings');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should update totalActiveBookings subject', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockBookings,
      };

      service.getActiveBookings().subscribe(() => {
        service.totalActiveBookings.subscribe((total) => {
          expect(total).toBe(2);
          done();
        });
      });

      const req = httpMock.expectOne('bookings');
      req.flush(mockResponse);
    });

    it('should handle empty bookings response', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: [],
      };

      service.getActiveBookings().subscribe(() => {
        expect(service.activeBookings.value.length).toBe(0);
        expect(service.totalActiveBookings.value).toBe(0);
        done();
      });

      const req = httpMock.expectOne('bookings');
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      service.getActiveBookings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('bookings');
      req.error(new ErrorEvent('Server error'));
    });
  });

  describe('bookRoom', () => {
    it('should book a room with formatted dates', (done) => {
      const mockResponse = {
        code: 201,
        message: 'Booking successful',
        data: {},
      };

      service.bookRoom(101, '2024-02-15', '2024-02-20').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('bookings/bookRoom');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        room_number: 101,
        check_in_date: '2024-02-15',
        check_out_date: '2024-02-20',
      });
      req.flush(mockResponse);
    });

    it('should format dates correctly', (done) => {
      const mockResponse = {
        code: 201,
        message: 'Booking successful',
        data: {},
      };

      service.bookRoom(102, '2024-02-15', '2024-02-20').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('bookings/bookRoom');
      const body = req.request.body;
      expect(body.check_in_date).toMatch(/2024-02-15/);
      expect(body.check_out_date).toMatch(/2024-02-20/);
      req.flush(mockResponse);
    });

    it('should handle booking error', (done) => {
      service.bookRoom(101, '2024-02-15', '2024-02-20').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('bookings/bookRoom');
      req.error(new ErrorEvent('Booking failed'));
    });

    it('should set correct Content-Type header', (done) => {
      service.bookRoom(101, '2024-02-15', '2024-02-20').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('bookings/bookRoom');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({ code: 201, message: 'Success', data: {} });
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking by ID', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Booking deleted',
        data: {},
      };

      service.deleteBooking('1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('bookings/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle deletion error', (done) => {
      service.deleteBooking('999').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('bookings/999');
      req.error(new ErrorEvent('Not found'));
    });
  });
});
