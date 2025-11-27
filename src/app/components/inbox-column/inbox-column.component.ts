import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentCardComponent } from '../document-card/document-card.component';
import { BureauDocument } from '../../shared/models/bureau-document';

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
  @Input() selectedId: number | null = null;

  @Output() selectItem = new EventEmitter<BureauDocument>();
}
