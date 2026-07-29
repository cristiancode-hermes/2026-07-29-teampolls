import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PollsService } from '../services/polls.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-poll-create-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Create Poll</h1>
        <p class="page-subtitle">Create a new poll for your team</p>
      </div>
    </div>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    <form (ngSubmit)="onSubmit()" class="create-form card">
      <div class="form-group">
        <label for="title">Question</label>
        <input id="title" type="text" class="input" [(ngModel)]="title" name="title" required minlength="3" maxlength="200" placeholder="What should we decide today?" />
      </div>

      <div class="form-group">
        <label for="description">Description (optional)</label>
        <textarea id="description" class="input" [(ngModel)]="description" name="description" rows="3" placeholder="Add context for your team..."></textarea>
      </div>

      <div class="form-group">
        <label>Options</label>
        @for (opt of options(); track $index) {
          <div class="option-row">
            <input type="text" class="input" [(ngModel)]="options()[$index]" [name]="'opt' + $index" required placeholder="Option {{ $index + 1 }}" />
            @if (options().length > 2) {
              <button type="button" class="btn btn-ghost btn-icon" (click)="removeOption($index)" title="Remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            }
          </div>
        }
        <button type="button" class="btn btn-ghost btn-sm" (click)="addOption()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add option
        </button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="deadline">Deadline (optional)</label>
          <input id="deadline" type="datetime-local" class="input" [(ngModel)]="deadline" name="deadline" />
        </div>
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="isAnonymous" name="isAnonymous" />
            <span>Anonymous voting</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <a routerLink="/dashboard" class="btn btn-ghost">Cancel</a>
        <button type="submit" class="btn btn-primary" [disabled]="loading() || !isValid()">
          {{ loading() ? 'Creating...' : 'Create Poll' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--color-ink); margin: 0; }
    .page-subtitle { color: var(--color-muted); margin: 0.25rem 0 0; font-size: 0.875rem; }
    .create-form { max-width: 640px; padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-group label { font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-row .form-group { flex: 1; min-width: 200px; }
    .option-row { display: flex; gap: 0.5rem; align-items: center; }
    .option-row .input { flex: 1; }
    .checkbox-group { justify-content: flex-end; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 400 !important; }
    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; padding-top: 0.5rem; border-top: 1px solid var(--color-border); }
    .alert { padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1rem; }
    .alert-error { background: color-mix(in srgb, var(--color-danger) 12%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 20%, transparent); }
  `]
})
export class PollCreatePageComponent {
  private pollsService = inject(PollsService);
  private router = inject(Router);

  protected title = '';
  protected description = '';
  protected deadline = '';
  protected isAnonymous = false;
  protected options = signal(['', '']);
  protected loading = signal(false);
  protected error = signal('');

  protected addOption() {
    this.options.update((opts) => [...opts, '']);
  }

  protected removeOption(index: number) {
    this.options.update((opts) => opts.filter((_, i) => i !== index));
  }

  protected isValid(): boolean {
    return this.title.trim().length >= 3 &&
      this.options().length >= 2 &&
      this.options().every((o) => o.trim().length > 0);
  }

  async onSubmit() {
    if (!this.isValid()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const poll = await lastValueFrom(this.pollsService.create({
        title: this.title.trim(),
        description: this.description.trim() || undefined,
        deadline: this.deadline ? new Date(this.deadline).toISOString() : undefined,
        isAnonymous: this.isAnonymous || undefined,
        options: this.options().map((o) => o.trim()).filter((o) => o),
      }));
      this.router.navigate(['/polls', poll.id]);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to create poll');
    } finally {
      this.loading.set(false);
    }
  }
}
