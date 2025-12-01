import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { BureauDocument } from '../../core/models/bureau-document.model';
import { DocumentStatus } from '../../core/models/document-status.enum';
import { DocumentService } from '../../core/services/document.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, RouterModule],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly documentService = inject(DocumentService);
  private readonly fb = inject(FormBuilder);

  document?: BureauDocument;
  readonly statuses = Object.values(DocumentStatus);
  saveMessage = '';

  form = this.fb.group({
    status: this.fb.control<DocumentStatus | null>(null),
    category: this.fb.control<string>(''),
    tags: this.fb.control<string>('')
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/documents']);
      return;
    }

    this.documentService
      .getDocumentById(id)
      .pipe(filter((value): value is BureauDocument => !!value))
      .subscribe((doc) => {
        this.document = doc;
        this.form.patchValue({
          status: doc.status,
          category: doc.category ?? '',
          tags: doc.tags.map((t) => t.name).join(', ')
        });
      });
  }

  save(): void {
    if (!this.document) return;

    const tags = (this.form.value.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name, index) => ({ id: index + 1, name }));

    this.documentService
      .updateDocument(this.document.id, {
        status: (this.form.value.status as DocumentStatus) ?? this.document.status,
        category: this.form.value.category ?? this.document.category,
        tags
      })
      .subscribe((updated) => {
        this.document = updated ?? this.document;
        this.saveMessage = 'Changes stored locally. Replace with PUT /api/documents when backend is available.';
      });
  }
}
