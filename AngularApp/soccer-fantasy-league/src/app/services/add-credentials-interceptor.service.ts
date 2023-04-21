import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddCredentialsInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    httpRequest = httpRequest.clone({
      withCredentials: true
    });
    return next.handle(httpRequest).pipe(
      catchError((err: any) => {
        if(err.status === 401) {
          return this.authService.logOut();
        } else {
          throw err;
        }
      })
    );
  }
}
