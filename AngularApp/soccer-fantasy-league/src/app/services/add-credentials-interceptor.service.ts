import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddCredentialsInterceptorService implements HttpInterceptor {

  private urlsToIgnore = [
    "api/auth/login",
    "api/auth/logout",
  ]

  constructor(private authService: AuthService) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.urlsToIgnore.every(url => httpRequest.url.search(url) === -1)) {
      httpRequest = httpRequest.clone({
        withCredentials: true
      });
    }
    return next.handle(httpRequest).pipe(
      catchError((err: any) => {
        if(err.status === 400) {
          return this.authService.logOut();
        } else {
          throw err;
        }
      })
    );
  }
}
