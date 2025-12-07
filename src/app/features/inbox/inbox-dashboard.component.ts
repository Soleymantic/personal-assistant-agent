import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DetailPanelComponent } from '../../components/detail-panel/detail-panel.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { InboxColumnComponent } from '../../components/inbox-column/inbox-column.component';
import { StatusFilterComponent } from '../../components/status-filter/status-filter.component';
import { InboxStore } from '../../services/inbox.store';

@Component({
  selector: 'app-inbox-dashboard',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, StatusFilterComponent, InboxColumnComponent, DetailPanelComponent],
  templateUrl: './inbox-dashboard.component.html',
  styleUrls: ['./inbox-dashboard.component.css']
})
export class InboxDashboardComponent {
  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor(readonly inbox: InboxStore) {
    this.applyTheme(this.theme());
  }

  applyAction(action: 'pay' | 'reply'): void {
    const current = this.inbox.selectedItem();
    const fallback = action === 'pay' ? 'Zahlung vorgemerkt' : 'Aktion ausgeführt';
    const message = current ? `${action} → ${current.title}` : fallback;
    console.info(message);
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  private getInitialTheme(): 'light' | 'dark' {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }

    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
