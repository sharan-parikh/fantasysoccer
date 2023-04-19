import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserInfo {
  username: string;
  dob: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://localhost:4200/api/auth"

  constructor(private http: HttpClient, private router: Router) { }

  logIn(email: string | null, password: string | null): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${this.baseUrl}/login`, {
      username: email,
      password: password
    });
  }

  logOut(): Observable<any> {
    // call the REST API to destroy current user session, if any.
    return this.http.post<any>(`${this.baseUrl}/logout`, {}).pipe(
      tap(res => {
        this.router.navigate(['']);
      })
    );
  }

  signUp(formValue: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, formValue);
  }
}
