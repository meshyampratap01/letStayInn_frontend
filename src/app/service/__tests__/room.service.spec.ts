import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoomService } from '../room.service';
import { room } from '../../models/room';

describe('RoomService', () => {
  let service: RoomService;
  let httpMock: HttpTestingController;

  const mockRooms: room[] = [
    {
      number: 101,
      type: 'Single',
      price: 100,
      description: 'Small room',
      is_available: true,
    } as any,
    {
      number: 102,
      type: 'Double',
      price: 150,
      description: 'Large room',
      is_available: false,
    } as any,
    {
      number: 103,
      type: 'Suite',
      price: 250,
      description: 'Luxury suite',
      is_available: true,
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoomService],
    });
    service = TestBed.inject(RoomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty rooms initially', (done) => {
      service.rooms.subscribe((rooms) => {
        expect(rooms.length).toBe(0);
        done();
      });
    });

    it('should have zero available rooms initially', (done) => {
      service._availableRooms.subscribe((available) => {
        expect(available).toBe(0);
        done();
      });
    });

    it('should have zero occupied rooms initially', (done) => {
      service._occupiedRooms.subscribe((occupied) => {
        expect(occupied).toBe(0);
        done();
      });
    });
  });

  describe('loadRooms', () => {
    it('should fetch rooms from API', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockRooms,
      };

      service.loadRooms().subscribe(() => {
        expect(service.rooms.value).toEqual(mockRooms);
        done();
      });

      const req = httpMock.expectOne('rooms');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should sort rooms by number', (done) => {
      const unsortedRooms: room[] = [
        { number: 103, is_available: true } as any,
        { number: 101, is_available: true } as any,
        { number: 102, is_available: false } as any,
      ];

      const mockResponse = {
        code: 200,
        message: 'Success',
        data: unsortedRooms,
      };

      service.loadRooms().subscribe(() => {
        const sortedRooms = service.rooms.value;
        expect(sortedRooms[0].number).toBe(101);
        expect(sortedRooms[1].number).toBe(102);
        expect(sortedRooms[2].number).toBe(103);
        done();
      });

      const req = httpMock.expectOne('rooms');
      req.flush(mockResponse);
    });

    it('should count available rooms correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockRooms,
      };

      service.loadRooms().subscribe(() => {
        service._availableRooms.subscribe((available) => {
          expect(available).toBe(2); // rooms 101 and 103
          done();
        });
      });

      const req = httpMock.expectOne('rooms');
      req.flush(mockResponse);
    });

    it('should count occupied rooms correctly', (done) => {
      const mockResponse = {
        code: 200,
        message: 'Success',
        data: mockRooms,
      };

      service.loadRooms().subscribe(() => {
        service._occupiedRooms.subscribe((occupied) => {
          expect(occupied).toBe(1); // room 102
          done();
        });
      });

      const req = httpMock.expectOne('rooms');
      req.flush(mockResponse);
    });

    it('should handle error gracefully', (done) => {
      service.loadRooms().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('rooms');
      req.error(new ErrorEvent('Server error'));
    });
  });

  describe('addRoom', () => {
    it('should add a new room', (done) => {
      const newRoom: room = {
        number: 104,
        type: 'Standard',
        price: 120,
        description: 'Standard room',
      } as any;

      const mockResponse = {
        code: 201,
        message: 'Room added',
        data: {},
      };

      service.addRoom(newRoom).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('rooms');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.number).toBe(104);
      req.flush(mockResponse);
    });

    it('should convert room number to number type', (done) => {
      const newRoom: room = {
        number: '105' as any,
        type: 'Standard',
        price: 120,
        description: 'Standard room',
      } as any;

      service.addRoom(newRoom).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('rooms');
      expect(typeof req.request.body.number).toBe('number');
      expect(req.request.body.number).toBe(105);
      req.flush({ code: 201, message: 'Success', data: {} });
    });

    it('should handle add room error', (done) => {
      const newRoom: room = {
        number: 104,
        type: 'Standard',
        price: 120,
        description: 'Room',
      } as any;

      service.addRoom(newRoom).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne('rooms');
      req.error(new ErrorEvent('Creation failed'));
    });
  });
});
