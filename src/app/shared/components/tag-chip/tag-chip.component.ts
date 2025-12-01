import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-tag-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.css']
})
export class TagChipComponent {
  @Input({ required: true }) tag!: Tag | string;

  get label(): string {
    return typeof this.tag === 'string' ? this.tag : this.tag.name;
  }
}
