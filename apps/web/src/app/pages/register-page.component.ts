import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <h2 class="auth-title">Create account</h2>
    <p class="auth-subtitle">Start making team decisions</p>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    <form (ngSubmit)="onSubmit()" class="auth-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" type="text" class="input" [(ngModel)]="username" name="username" required minlength="3" maxlength="50" placeholder="johndoe" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" class="input" [(ngModel)]="email" name="email" required autocomplete="email" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" class="input" [(ngModel)]="password" name="password" required minlength="6" placeholder="••••••••" />
      </div>
      <button type="submit" class="btn btn-primary btn-full" [disabled]="loading()">
        {{ loading() ? 'Creating account...' : 'Create account' }}
      </button>
    </form>

    <p class="auth-footer">
      Already have an account? <a routerLink="/login">Sign in</a>
    </p>
  `,
  styles: [`
    .auth-title { font-size: 1.5rem; font-weight: 700; color: var(--color-ink); margin: 0 0 0.25rem; }
    .auth-subtitle { color: var(--color-muted); margin: 0 0 1.5rem; font-size: 0.875rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--color-muted); }
    .auth-footer a { color: var(--color-primary); text-decoration: none; font-weight: 500; }
    .alert { padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1rem; }
    .alert-error { background: color-mix(in srgb, var(--color-danger) 12%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 20%, transparent); }
  `]
})
export class RegisterPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected username = '';
  protected email = '';
  protected password = '';
  protected loading = signal(false);
  protected error = signal('');

  async onSubmit() {
    if (!this.username || !this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await lastValueFrom(this.auth.register(this.username, this.email, this.password));
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Registration failed');
    } finally {
      this.loading.set(false);
    }
  }
}
