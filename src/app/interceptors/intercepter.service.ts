import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IntercepterService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the authentication token from the AuthService
    const authToken = this.authService.getToken(); // Fetch the token from your AuthService
    const loginUrl = 'auth/login';
    const registerUrl = 'auth/register'

    // Check if the request URL matches the login route
    if (req.url.includes(loginUrl) ||  req.url.includes(registerUrl)) {
      return next.handle(req);
    }

    // Clone the request and attach the Bearer token to the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Pass the cloned request to the next handler
    return next.handle(authReq);
  }
}
