import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

const BaseUrl = 'https://letstayinn.api.prime1.me/';

export function BaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){
  const path = (req.url || '').replace(/^\//, '');
  const apiReq = req.clone({ url: `${BaseUrl}${path}` });
  return next(apiReq);
}