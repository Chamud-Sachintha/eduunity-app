import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'src/app/models/Auth/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerNewUserInfo(authInfo: Auth) {
    const path = environment.apiUrl + "auth/register";
    return this.http.post(path, authInfo);
  }

  authenticateUser(authIno: Auth) {
    const path = environment.apiUrl + "auth/login";
    return this.http.post(path, authIno);
  }

  getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
