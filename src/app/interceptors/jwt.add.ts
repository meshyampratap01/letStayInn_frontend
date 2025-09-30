import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function AddJwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (req.url.includes('login') || req.url.includes('signup')) {
    return next(req);
  }

  const token = JSON.parse(localStorage.getItem('token') as string);
  console.log(token)
  if (token) {
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(newReq);
  }

  return next(req);
}
