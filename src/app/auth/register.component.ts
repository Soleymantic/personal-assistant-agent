import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordRepeat: ['', [Validators.required]]
  });

  errorMessage = '';

  register(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.passwordRepeat) {
      this.errorMessage = this.form.value.password !== this.form.value.passwordRepeat ? 'Passwörter stimmen nicht überein.' : '';
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } = this.form.getRawValue();
    this.errorMessage = '';

    this.auth.register({ firstName, lastName, email, password }).subscribe({
      next: (response) => {
        if ('accessToken' in response) {
          this.router.navigate(['/']);
          return;
        }

        this.auth.login({ email, password }).subscribe({
          next: () => this.router.navigate(['/']),
          error: () => (this.errorMessage = 'Login nach Registrierung fehlgeschlagen.')
        });
      },
      error: () => (this.errorMessage = 'Registrierung fehlgeschlagen. Bitte Eingaben prüfen.')
    });
  }
}
