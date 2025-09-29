import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

const BaseUrl = 'http://localhost:8080/api/v1/';

export function BaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){
  const apiReq = req.clone({ url: `${BaseUrl}${req.url}` })
  return next(apiReq);
}