import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { StatusFilterComponent } from './components/status-filter/status-filter.component';
import { InboxColumnComponent } from './components/inbox-column/inbox-column.component';
import { DetailPanelComponent } from './components/detail-panel/detail-panel.component';
import { InboxStore } from './services/inbox.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, StatusFilterComponent, InboxColumnComponent, DetailPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(readonly inbox: InboxStore) {}

  applyAction(action: 'pay' | 'reply'): void {
    const current = this.inbox.selectedItem();
    const fallback = action === 'pay' ? 'Zahlung vorgemerkt' : 'Aktion ausgeführt';
    const message = current ? `${action} → ${current.title}` : fallback;
    console.info(message);
  }
}
