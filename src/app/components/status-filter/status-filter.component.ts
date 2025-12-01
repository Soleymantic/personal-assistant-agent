import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentStatus } from '../../core/models/document-status.enum';

@Component({
  selector: 'app-status-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.css']
})
export class StatusFilterComponent {
  readonly statuses = DocumentStatus;

  @Input() activeStatus: 'all' | DocumentStatus = 'all';
  @Output() setStatus = new EventEmitter<'all' | DocumentStatus>();
}
