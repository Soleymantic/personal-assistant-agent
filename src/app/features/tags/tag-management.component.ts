import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../core/models/tag.model';
import { TagService } from '../../core/services/tag.service';

@Component({
  selector: 'app-tag-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.css']
})
export class TagManagementComponent implements OnInit {
  private readonly tagService = inject(TagService);
  tags: Tag[] = [];
  newTagName = '';
  renameBuffer: Record<number, string> = {};
  message = '';

  ngOnInit(): void {
    this.tagService.getTags().subscribe((tags) => {
      this.tags = tags;
      this.tags.forEach((tag) => (this.renameBuffer[tag.id] = tag.name));
    });
  }

  createTag(): void {
    if (!this.newTagName.trim()) return;
    this.tagService.createTag(this.newTagName.trim()).subscribe((tag) => {
      this.message = `Created tag ${tag.name}. Replace with POST /api/tags when available.`;
      this.newTagName = '';
    });
  }

  renameTag(tag: Tag): void {
    const nextName = this.renameBuffer[tag.id]?.trim();
    if (!nextName) return;
    this.tagService.renameTag(tag.id, nextName).subscribe((updated) => {
      this.message = `Renamed to ${updated?.name ?? nextName}. Hook this up to PUT /api/tags/{id} later.`;
    });
  }
}
