import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent {
  @Input() searchTerm = '';
  @Input() selectedTags: string[] = [];
  @Input() availableTags: string[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() toggleTag = new EventEmitter<string>();
}
