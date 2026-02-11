import { HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";

export function loggingInterceptor(r: HttpRequest<unknown>,next: HttpHandlerFn ){
  return next(r);
}