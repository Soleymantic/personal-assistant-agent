import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCallbackComponent implements OnInit {
  error = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      this.auth.setTokens(accessToken, refreshToken);
      this.auth
        .getCurrentUser()
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: () => this.router.navigate(['/'])
        });
      return;
    }

    this.error = 'Authentifizierung fehlgeschlagen. Bitte erneut anmelden.';
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
