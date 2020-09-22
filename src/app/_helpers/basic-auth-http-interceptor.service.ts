import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
      alert('i m ');
      if (localStorage.getItem('currentUser') && localStorage.getItem('accessToken')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer  ${localStorage.getItem('accessToken')}`
        }
      });
    }
      return next.handle(req);
  }
}
