import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BureauDocument } from '../../shared/models/bureau-document';

@Component({
  selector: 'app-status-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.css']
})
export class StatusFilterComponent {
  @Input() activeStatus: 'all' | BureauDocument['status'] = 'all';
  @Output() setStatus = new EventEmitter<'all' | BureauDocument['status']>();
}
