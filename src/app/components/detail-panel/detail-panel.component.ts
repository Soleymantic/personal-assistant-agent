import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BureauDocument } from '../../shared/models/bureau-document';

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
}
