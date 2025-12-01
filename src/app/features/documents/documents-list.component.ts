import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { BureauDocument } from '../../core/models/bureau-document.model';
import { DocumentService } from '../../core/services/document.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);

  documents: BureauDocument[] = [];

  ngOnInit(): void {
    this.documentService
      .getDocuments()
      .pipe(map((docs) => docs.sort((a, b) => a.title.localeCompare(b.title))))
      .subscribe((docs) => (this.documents = docs));
  }

  openDocument(doc: BureauDocument): void {
    this.router.navigate(['/documents', doc.id]);
  }
}
