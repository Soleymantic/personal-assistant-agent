import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { TagChipComponent } from './components/tag-chip/tag-chip.component';

@NgModule({
  imports: [CommonModule, StatusBadgeComponent, TagChipComponent],
  exports: [StatusBadgeComponent, TagChipComponent]
})
export class SharedModule {}
