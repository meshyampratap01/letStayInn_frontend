import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
 
export function AddJwtInterceptor(req:HttpRequest<unknown>,next:HttpHandlerFn) {
    if(req.url.includes('login') ||req.url.includes('signup')){
        return next(req)
    }
    const token=localStorage.getItem('token')
    const newReq=req.clone({
        headers:req.headers.set('Authentication',token as string)
    })
    return next(newReq)
}