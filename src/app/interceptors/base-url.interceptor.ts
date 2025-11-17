import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

const BaseUrl = 'https://d1rbflkxx9.execute-api.ap-south-1.amazonaws.com/v1/';

export function BaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){
  const apiReq = req.clone({ url: `${BaseUrl}${req.url}` })
  return next(apiReq);
}