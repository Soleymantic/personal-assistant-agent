import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BureauDocument } from '../../core/models/bureau-document.model';

@Component({
  selector: 'app-document-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.css']
})
export class DocumentCardComponent {
  @Input({ required: true }) document!: BureauDocument;
  @Input() selected = false;
  @Input() accent: 'warning' | 'danger' | 'success' = 'warning';

  @Output() select = new EventEmitter<BureauDocument>();

  formatDue(due?: string | null): string {
    if (!due) {
      return 'Keine Fälligkeit';
    }
    const date = new Date(due);
    if (isNaN(date.getTime())) {
      return due;
    }
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) {
      return 'Fällig heute';
    }
    if (diff > 0) {
      return `Fällig in ${diff} Tagen`;
    }
    return `Überfällig seit ${Math.abs(diff)} Tagen`;
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }
}
