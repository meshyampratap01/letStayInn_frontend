import { HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";

export function loggingInterceptor(r: HttpRequest<unknown>,next: HttpHandlerFn ){
  // console.log('outgoing request');
  // console.log(r)
  // return next(r).pipe(tap({
  //   next: event => {
  //     if (event.type === HttpEventType.Response){
  //       console.log('Incoming response')
  //       console.log(event.status)
  //       console.log(event.body)
  //     }
  //   }
  // }))
}