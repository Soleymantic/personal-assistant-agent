import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BureauDocument } from '../../shared/models/bureau-document';

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
}
