import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    const hasToken = this.getAccessToken();
    if (hasToken) {
      this.getCurrentUser().subscribe({
        error: () => this.clearTokens()
      });
    }
  }

  register(data: { email: string; password: string; firstName: string; lastName: string }): Observable<AuthResponse | User> {
    return this.http
      .post<User | AuthResponse>(`${environment.apiBaseUrl}/api/auth/register`, data)
      .pipe(switchMap((response) => this.handleRegisterResponse(response, data)));
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/login`, credentials)
      .pipe(tap((response) => this.applyAuthResponse(response)));
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/refresh`, { refreshToken })
      .pipe(tap((response) => this.setTokens(response.accessToken, response.refreshToken)));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/api/user/me`).pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        this.currentUserSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
  }

  getRefreshToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  }

  ensureDebugUser(): void {
    if (!environment.authBypass || this.currentUserSubject.value) {
      return;
    }

    const debugUser: User = {
      id: 'debug',
      email: 'debug@example.com',
      firstName: 'Debug',
      lastName: 'User',
      roles: ['debug']
    };

    this.currentUserSubject.next(debugUser);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private applyAuthResponse(response: AuthResponse): void {
    this.setTokens(response.accessToken, response.refreshToken);
    this.currentUserSubject.next(response.user);
  }

  private handleRegisterResponse(
    response: User | AuthResponse,
    credentials: { email: string; password: string }
  ): Observable<AuthResponse | User> {
    if (this.isAuthResponse(response)) {
      this.applyAuthResponse(response);
      return of(response);
    }

    return this.login({ email: credentials.email, password: credentials.password });
  }

  private isAuthResponse(response: User | AuthResponse): response is AuthResponse {
    return (response as AuthResponse).accessToken !== undefined;
  }
}
