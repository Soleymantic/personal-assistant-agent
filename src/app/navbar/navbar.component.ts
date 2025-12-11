import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { UserSessionComponent } from './user-session.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, UserSessionComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);

  readonly user$ = this.auth.currentUser$;

  logout(): void {
    this.auth.logout();
  }
}
