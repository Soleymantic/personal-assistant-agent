import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BureauDocument } from '../../core/models/bureau-document.model';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-panel.component.html',
  styleUrls: ['./detail-panel.component.css']
})
export class DetailPanelComponent {
  @Input() document: BureauDocument | null = null;

  @Output() pay = new EventEmitter<void>();
  @Output() reply = new EventEmitter<void>();

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
