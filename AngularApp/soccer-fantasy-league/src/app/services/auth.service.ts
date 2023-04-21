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

  private baseUrl = "http://localhost:3000/api"

  constructor(private http: HttpClient, private router: Router) { }

  logIn(email: string | null, password: string | null): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${this.baseUrl}/auth/login`, {
      username: email,
      password: password
    });
  }

  logOut(): Observable<any> {
    // call the REST API to destroy current user session, if any.
    return this.http.post<any>(`${this.baseUrl}/auth/logout`, {});
  }

  signUp(formValue: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/signup`, formValue);
  }

  abandonAccount(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/user`);
  }
}
