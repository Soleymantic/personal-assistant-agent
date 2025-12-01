import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const shouldSkip = req.url.includes('/actuator/health');
    const apiKey = environment.apiKey;

    if (shouldSkip || !apiKey) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        'X-API-KEY': apiKey
      }
    });

    return next.handle(cloned);
  }
}
