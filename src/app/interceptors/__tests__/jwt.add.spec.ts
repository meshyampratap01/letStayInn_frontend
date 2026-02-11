import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AddJwtInterceptor } from '../jwt.add';

describe('AddJwtInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('token handling', () => {
    it('should skip Authorization header for login requests', () => {
      const req = new HttpRequest('POST', '/auth/login', {});
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request.headers.has('Authorization')).toBe(false);
        return null;
      };

      AddJwtInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });

    it('should skip Authorization header for signup requests', () => {
      const req = new HttpRequest('POST', '/auth/signup', {});
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request.headers.has('Authorization')).toBe(false);
        return null;
      };

      AddJwtInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });

    it('should add Authorization header to protected requests', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', JSON.stringify(token));

      const req = new HttpRequest('GET', '/api/protected', {});
      let nextCalled = false;
      let modifiedReq: any;

      const mockNext = (request: any) => {
        nextCalled = true;
        modifiedReq = request;
        return null;
      };

      AddJwtInterceptor(req, mockNext as any);

      expect(nextCalled).toBe(true);
      expect(modifiedReq.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });

    it('should not add Authorization header if no token exists', () => {
      localStorage.removeItem('token');
      const req = new HttpRequest('GET', '/api/protected', {});
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request.headers.has('Authorization')).toBe(false);
        return null;
      };

      AddJwtInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });

    it('should preserve other headers when adding Authorization', () => {
      const token = 'test-token';
      localStorage.setItem('token', JSON.stringify(token));

      let req = new HttpRequest('GET', '/api/data', {});
      req = req.clone({
        headers: req.headers.set('Custom-Header', 'custom-value'),
      });

      let modifiedReq: any;
      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      AddJwtInterceptor(req, mockNext as any);

      expect(modifiedReq.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(modifiedReq.headers.get('Custom-Header')).toBe('custom-value');
    });

    it('should work with different HTTP methods', () => {
      const token = 'test-token';
      localStorage.setItem('token', JSON.stringify(token));

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      methods.forEach((method) => {
        const req = new HttpRequest(method, '/api/test', {});
        let modifiedReq: any;

        const mockNext = (request: any) => {
          modifiedReq = request;
          return null;
        };

        AddJwtInterceptor(req, mockNext as any);
        expect(modifiedReq.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });
  });
});
