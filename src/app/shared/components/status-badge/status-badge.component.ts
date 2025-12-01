import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DocumentStatus } from '../../../core/models/document-status.enum';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: DocumentStatus;

  get cssClass(): string {
    switch (this.status) {
      case DocumentStatus.PAID:
        return 'badge paid';
      case DocumentStatus.NEEDS_ACTION:
        return 'badge action';
      default:
        return 'badge pending';
    }
  }
}
