import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);

  readonly theme$ = this.themeService.themeChanges;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMessage = '';

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate([redirectTo || '/']),
      error: () => (this.errorMessage = 'Login fehlgeschlagen. Bitte Zugangsdaten prüfen.')
    });
  }

  loginWithGoogle(): void {
    window.location.href = `${environment.apiBaseUrl}/oauth2/authorization/google`;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
