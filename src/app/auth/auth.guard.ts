import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      return of(this.router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } }));
    }

    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (user) {
          return of(true);
        }
        return this.authService.getCurrentUser().pipe(map(() => true));
      }),
      catchError(() => of(this.router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } })))
    );
  }
}
