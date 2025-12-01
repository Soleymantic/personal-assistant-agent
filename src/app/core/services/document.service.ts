import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BureauDocument } from '../models/bureau-document.model';
import { DocumentStatus } from '../models/document-status.enum';
import { Tag } from '../models/tag.model';

const seedTags: Tag[] = [
  { id: 1, name: 'invoice' },
  { id: 2, name: 'utilities' },
  { id: 3, name: 'priority' }
];

const seedDocuments: BureauDocument[] = [
  {
    id: crypto.randomUUID(),
    title: 'Electricity Invoice January',
    sender: 'Utility Corp',
    amount: 89.5,
    due: '2024-02-15',
    status: DocumentStatus.NEEDS_ACTION,
    category: 'Energy',
    summary: 'Monthly electricity bill for January including meter readings and payment details.',
    tags: [seedTags[0], seedTags[1], seedTags[2]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Salary Statement',
    sender: 'ACME Corp',
    amount: 3500,
    due: null,
    status: DocumentStatus.PAID,
    category: 'Income',
    summary: 'Statement of earnings for February with tax and benefit breakdown.',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Insurance Renewal',
    sender: 'Best Insurance',
    amount: 420.75,
    due: '2024-03-01',
    status: DocumentStatus.PENDING,
    category: 'Insurance',
    summary: 'Policy renewal reminder for household insurance. Review coverage and update payment.',
    tags: [seedTags[2]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly endpoint = `${environment.apiUrl}/api/documents`;
  private readonly documents$ = new BehaviorSubject<BureauDocument[]>(seedDocuments);

  constructor(private readonly http: HttpClient) {}

  /**
   * List all documents. Replace the mocked BehaviorSubject with a real GET call once the backend is ready.
   */
  getDocuments(): Observable<BureauDocument[]> {
    // return this.http.get<BureauDocument[]>(this.endpoint);
    return this.documents$.asObservable();
  }

  getDocumentById(id: string): Observable<BureauDocument | undefined> {
    // return this.http.get<BureauDocument>(`${this.endpoint}/${id}`);
    return this.getDocuments().pipe(map((docs) => docs.find((doc) => doc.id === id)));
  }

  updateDocument(id: string, update: Partial<BureauDocument>): Observable<BureauDocument | undefined> {
    // return this.http.put<BureauDocument>(`${this.endpoint}/${id}`, update);
    const current = this.documents$.value;
    const next = current.map((doc) => (doc.id === id ? { ...doc, ...update, updatedAt: new Date().toISOString() } : doc));
    this.documents$.next(next);
    return of(next.find((doc) => doc.id === id));
  }
}
