import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HealthResponse {
  status: string;
  components?: Record<string, unknown>;
  details?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly endpoint = `${environment.apiUrl}/actuator/health`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Calls the backend health-check endpoint. The API is public and does not require the X-API-KEY header.
   */
  checkHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(this.endpoint).pipe(
      map((response) => ({ ...response })),
      catchError((error) => {
        return of({ status: 'DOWN', details: { error } } as HealthResponse);
      })
    );
  }
}
