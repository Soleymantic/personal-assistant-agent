import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DetailPanelComponent } from '../../components/detail-panel/detail-panel.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { InboxColumnComponent } from '../../components/inbox-column/inbox-column.component';
import { StatusFilterComponent } from '../../components/status-filter/status-filter.component';
import { InboxStore } from '../../services/inbox.store';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-inbox-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FilterBarComponent,
    StatusFilterComponent,
    InboxColumnComponent,
    DetailPanelComponent
  ],
  templateUrl: './inbox-dashboard.component.html',
  styleUrls: ['./inbox-dashboard.component.css']
})
export class InboxDashboardComponent {
  private readonly auth = inject(AuthService);
  readonly inbox = inject(InboxStore);
  readonly user$ = this.auth.currentUser$;

  clearSelection(): void {
    this.inbox.selectedItem.set(null);
  }

  applyAction(action: 'pay' | 'reply'): void {
    const current = this.inbox.selectedItem();
    const fallback = action === 'pay' ? 'Zahlung vorgemerkt' : 'Aktion ausgeführt';
    const message = current ? `${action} → ${current.title}` : fallback;
    console.info(message);
  }

  logout(): void {
    this.auth.logout();
  }
}
