import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PollsService } from '../services/polls.service';
import { Poll } from '../interfaces';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Polls</h1>
        <p class="page-subtitle">Manage your team polls</p>
      </div>
      <a routerLink="/polls/new" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Poll
      </a>
    </div>

    @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading polls...</p>
      </div>
    } @else if (error()) {
      <div class="empty-state">
        <p class="empty-icon">⚠️</p>
        <h3>Error loading polls</h3>
        <p>{{ error() }}</p>
        <button class="btn btn-primary" (click)="loadPolls()">Retry</button>
      </div>
    } @else if (polls().length === 0) {
      <div class="empty-state">
        <p class="empty-icon">📊</p>
        <h3>No polls yet</h3>
        <p>Create your first poll to start gathering team feedback</p>
        <a routerLink="/polls/new" class="btn btn-primary">Create Poll</a>
      </div>
    } @else {
      <div class="poll-grid">
        @for (poll of polls(); track poll.id) {
          <a [routerLink]="['/polls', poll.id]" class="poll-card card">
            <div class="poll-card-header">
              <span class="poll-status" [class.open]="poll.status === 'open'" [class.closed]="poll.status === 'closed'">
                {{ poll.status === 'open' ? 'Open' : 'Closed' }}
              </span>
              @if (poll.isAnonymous) {
                <span class="poll-badge">Anonymous</span>
              }
            </div>
            <h3 class="poll-card-title">{{ poll.title }}</h3>
            @if (poll.description) {
              <p class="poll-card-desc">{{ poll.description }}</p>
            }
            <div class="poll-card-meta">
              <span>{{ poll.options?.length || 0 }} options</span>
              <span>{{ poll.createdAt | date:'MMM d, yyyy' }}</span>
            </div>
          </a>
        }
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--color-ink); margin: 0; }
    .page-subtitle { color: var(--color-muted); margin: 0.25rem 0 0; font-size: 0.875rem; }
    .loading-state, .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 3rem; margin: 0 0 1rem; }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .poll-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .poll-card { display: block; padding: 1.25rem; text-decoration: none; color: inherit; transition: transform 0.15s, box-shadow 0.15s; }
    .poll-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .poll-card-header { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
    .poll-status { font-size: 0.75rem; font-weight: 600; padding: 0.125rem 0.5rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
    .poll-status.open { background: color-mix(in srgb, #22c55e 12%, transparent); color: #22c55e; }
    .poll-status.closed { background: color-mix(in srgb, #6b7280 12%, transparent); color: #6b7280; }
    .poll-badge { font-size: 0.75rem; font-weight: 500; padding: 0.125rem 0.5rem; border-radius: 999px; background: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary); }
    .poll-card-title { font-size: 1rem; font-weight: 600; margin: 0 0 0.375rem; color: var(--color-ink); }
    .poll-card-desc { font-size: 0.8125rem; color: var(--color-muted); margin: 0 0 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .poll-card-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-muted); }
  `]
})
export class DashboardPageComponent implements OnInit {
  private pollsService = inject(PollsService);

  protected readonly polls = signal<Poll[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit() {
    this.loadPolls();
  }

  protected async loadPolls() {
    this.loading.set(true);
    this.error.set('');
    try {
      const res = await lastValueFrom(this.pollsService.getAll());
      this.polls.set(res);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to load polls');
    } finally {
      this.loading.set(false);
    }
  }
}
