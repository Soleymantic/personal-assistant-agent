import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authReq = this.addAuthorizationHeader(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthRequest(authReq.url)) {
          return this.handle401Error(authReq, next);
        }
        if (error.status === 401) {
          this.authService.logout();
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthorizationHeader(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.authService.getAccessToken();
    if (!token) {
      return req;
    }

    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => !!token),
        take(1),
        switchMap(() => next.handle(this.addAuthorizationHeader(req)))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((response) => {
        this.refreshTokenSubject.next(response.accessToken);
        return next.handle(this.addAuthorizationHeader(req));
      }),
      catchError((error) => {
        this.authService.logout();
        this.router.navigate(['/login']);
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private isAuthRequest(url: string): boolean {
    return url.includes('/api/auth/login') || url.includes('/api/auth/register') || url.includes('/api/auth/refresh');
  }
}
