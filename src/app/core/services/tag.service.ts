import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag } from '../models/tag.model';

const initialTags: Tag[] = [
  { id: 1, name: 'invoice' },
  { id: 2, name: 'priority' },
  { id: 3, name: 'utilities' }
];

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly endpoint = `${environment.apiUrl}/api/tags`;
  private readonly tags$ = new BehaviorSubject<Tag[]>(initialTags);

  constructor(private readonly http: HttpClient) {}

  /**
   * Replace this mocked stream with a GET call once the backend endpoint is available.
   */
  getTags(): Observable<Tag[]> {
    // return this.http.get<Tag[]>(this.endpoint);
    return this.tags$.asObservable();
  }

  createTag(name: string): Observable<Tag> {
    // return this.http.post<Tag>(this.endpoint, { name });
    const next: Tag = { id: Date.now(), name };
    this.tags$.next([...this.tags$.value, next]);
    return of(next);
  }

  renameTag(id: number, name: string): Observable<Tag | undefined> {
    // return this.http.put<Tag>(`${this.endpoint}/${id}`, { name });
    const updated = this.tags$.value.map((tag) => (tag.id === id ? { ...tag, name } : tag));
    this.tags$.next(updated);
    return of(updated.find((tag) => tag.id === id));
  }
}
