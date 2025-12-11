import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly legacyStorageKey = 'preferred-theme';
  private readonly theme = new BehaviorSubject<Theme>(this.getInitialTheme());

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyTheme(this.theme.value);
  }

  get themeChanges(): Observable<Theme> {
    return this.theme.asObservable();
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.theme.value === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  private setTheme(theme: Theme): void {
    this.theme.next(theme);
    this.persistTheme(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private getInitialTheme(): Theme {
    const stored = this.readStoredTheme();
    if (stored) return stored;

    const prefersDark =
      this.document.defaultView?.matchMedia &&
      this.document.defaultView.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private readStoredTheme(): Theme | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem(this.storageKey) ?? localStorage.getItem(this.legacyStorageKey);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return null;
  }

  private persistTheme(theme: Theme): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, theme);
    localStorage.removeItem(this.legacyStorageKey);
  }
}
