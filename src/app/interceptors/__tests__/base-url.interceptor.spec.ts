import { HttpRequest } from '@angular/common/http';
import { BaseUrlInterceptor } from '../base-url.interceptor';

describe('BaseUrlInterceptor', () => {
  const baseUrl = 'https://letstayinn.api.prime1.me/';

  describe('URL prepending', () => {
    it('should prepend base URL to requests', () => {
      const req = new HttpRequest('GET', '/api/users', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}api/users`);
    });

    it('should prepend base URL to POST requests', () => {
      const req = new HttpRequest('POST', '/auth/login', { email: 'test@example.com' });
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}auth/login`);
    });

    it('should work with nested paths', () => {
      const req = new HttpRequest('GET', '/api/v1/users/123', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}api/v1/users/123`);
    });

    it('should preserve query parameters in URL', () => {
      const req = new HttpRequest('GET', '/api/users?page=1', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toContain(`${baseUrl}api/users`);
    });
  });

  describe('HTTP methods', () => {
    it('should work with GET requests', () => {
      const req = new HttpRequest('GET', '/test', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.method).toBe('GET');
      expect(modifiedReq.url).toBe(`${baseUrl}test`);
    });

    it('should work with POST requests', () => {
      const req = new HttpRequest('POST', '/test', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.method).toBe('POST');
      expect(modifiedReq.url).toBe(`${baseUrl}test`);
    });

    it('should work with PUT requests', () => {
      const req = new HttpRequest('PUT', '/test/1', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.method).toBe('PUT');
    });

    it('should work with DELETE requests', () => {
      const req = new HttpRequest('DELETE', '/test/1', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.method).toBe('DELETE');
    });
  });

  describe('edge cases', () => {
    it('should handle empty path', () => {
      const req = new HttpRequest('GET', '', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}`);
    });

    it('should preserve request body', () => {
      const testData = { key: 'value', nested: { inner: 'data' } };
      const req = new HttpRequest('POST', '/api/data', testData);
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.body).toEqual(testData);
    });

    it('should preserve request headers', () => {
      let req = new HttpRequest('GET', '/api/test', {});
      req = req.clone({
        headers: req.headers.set('Custom-Header', 'custom-value'),
      });

      let modifiedReq: any;
      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.headers.get('Custom-Header')).toBe('custom-value');
    });
  });

  describe('real endpoint paths', () => {
    it('should prepend to auth endpoints', () => {
      const req = new HttpRequest('POST', '/auth/login', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}auth/login`);
    });

    it('should prepend to booking endpoints', () => {
      const req = new HttpRequest('GET', '/bookings', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}bookings`);
    });

    it('should prepend to profile endpoint', () => {
      const req = new HttpRequest('GET', '/profile', {});
      let modifiedReq: any;

      const mockNext = (request: any) => {
        modifiedReq = request;
        return null;
      };

      BaseUrlInterceptor(req, mockNext as any);
      expect(modifiedReq.url).toBe(`${baseUrl}profile`);
    });
  });
});
