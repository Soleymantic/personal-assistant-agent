import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BureauDocument } from '../../core/models/bureau-document.model';
import { DocumentCardComponent } from '../document-card/document-card.component';

@Component({
  selector: 'app-inbox-column',
  standalone: true,
  imports: [CommonModule, DocumentCardComponent],
  templateUrl: './inbox-column.component.html',
  styleUrls: ['./inbox-column.component.css']
})
export class InboxColumnComponent {
  @Input() title = '';
  @Input() items: BureauDocument[] = [];
  @Input() accent: 'warning' | 'danger' | 'success' = 'warning';
  @Input() selectedId: string | null = null;

  @Output() selectItem = new EventEmitter<BureauDocument>();
}
