import { HttpRequest } from '@angular/common/http';
import { loggingInterceptor } from '../logging.interceptor';

describe('LoggingInterceptor', () => {
  describe('interceptor behavior', () => {
    it('should pass through requests', () => {
      const req = new HttpRequest('GET', '/api/test', {});
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request).toBe(req);
        return null;
      };

      loggingInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });

    it('should work with POST requests', () => {
      const req = new HttpRequest('POST', '/api/test', { key: 'value' });
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request.method).toBe('POST');
        return null;
      };

      loggingInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });

    it('should work with PUT requests', () => {
      const req = new HttpRequest('PUT', '/api/test/1', { updated: true });
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request.method).toBe('PUT');
        return null;
      };

      loggingInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });

    it('should work with DELETE requests', () => {
      const req = new HttpRequest('DELETE', '/api/test/1', null);
      let nextCalled = false;

      const mockNext = (request: any) => {
        nextCalled = true;
        expect(request.method).toBe('DELETE');
        return null;
      };

      loggingInterceptor(req, mockNext as any);
      expect(nextCalled).toBe(true);
    });
  });

  describe('logging functionality', () => {
    it('should be a functional interceptor', () => {
      expect(typeof loggingInterceptor).toBe('function');
    });

    it('should accept HttpRequest and HttpHandlerFn parameters', () => {
      const req = new HttpRequest('GET', '/test', {});
      const mockNext = () => null;

      expect(() => {
        loggingInterceptor(req, mockNext as any);
      }).not.toThrow();
    });

    it('should preserve original request properties', () => {
      const req = new HttpRequest('POST', '/api/data', { test: 'data' });
      let capturedReq: any;

      const mockNext = (request: any) => {
        capturedReq = request;
        return null;
      };

      loggingInterceptor(req, mockNext as any);

      expect(capturedReq.method).toBe(req.method);
      expect(capturedReq.url).toBe(req.url);
      expect(capturedReq.body).toEqual(req.body);
    });
  });

  describe('note on logging implementation', () => {
    it('should have logging code available for future implementation', () => {
      // The loggingInterceptor has the framework for logging but it's currently commented out
      // This test confirms the interceptor exists and can be enhanced with logging
      expect(loggingInterceptor).toBeDefined();
    });
  });
});
