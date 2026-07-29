import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PollsService } from '../services/polls.service';
import { Poll, VoteResult } from '../interfaces';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-poll-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    @if (loading()) {
      <div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>
    } @else if (error()) {
      <div class="empty-state">
        <p class="empty-icon">⚠️</p>
        <h3>Error</h3>
        <p>{{ error() }}</p>
        <button class="btn btn-primary" (click)="loadPoll()">Retry</button>
      </div>
    } @else if (poll()) {
      <div class="page-header">
        <div>
          <a routerLink="/dashboard" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to polls
          </a>
          <h1 class="page-title">{{ poll()!.title }}</h1>
          @if (poll()!.description) {
            <p class="page-subtitle">{{ poll()!.description }}</p>
          }
        </div>
      </div>

      <div class="poll-meta">
        <span class="poll-status" [class.open]="poll()!.status === 'open'" [class.closed]="poll()!.status === 'closed'">
          {{ poll()!.status === 'open' ? 'Open' : 'Closed' }}
        </span>
        @if (poll()!.isAnonymous) {
          <span class="tag">Anonymous</span>
        }
        @if (poll()!.deadline) {
          <span class="meta-item">Deadline: {{ poll()!.deadline | date:'MMM d, yyyy HH:mm' }}</span>
        }
        <span class="meta-item">{{ totalVotes() }} vote{{ totalVotes() !== 1 ? 's' : '' }}</span>
      </div>

      <div class="poll-actions">
        @if (poll()!.status === 'open' && canVote()) {
          <div class="vote-section card">
            <h3>Cast your vote</h3>
            <div class="options-list">
              @for (opt of poll()!.options; track opt.id) {
                <button class="option-btn" [class.selected]="selectedOption() === opt.id" (click)="selectOption(opt.id)" [disabled]="voting()">
                  <span class="option-text">{{ opt.text }}</span>
                  @if (selectedOption() === opt.id) {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  }
                </button>
              }
            </div>
            <button class="btn btn-primary" [disabled]="!selectedOption() || voting()" (click)="castVote()">
              {{ voting() ? 'Voting...' : 'Submit Vote' }}
            </button>
          </div>
        }

        @if (poll()!.createdById === currentUserId()) {
          <div class="manage-section card">
            <h3>Manage</h3>
            <div class="manage-actions">
              @if (poll()!.status === 'open') {
                <button class="btn btn-secondary" (click)="closePoll()">Close Poll</button>
              } @else {
                <button class="btn btn-secondary" (click)="reopenPoll()">Reopen Poll</button>
              }
              <button class="btn btn-danger" (click)="deletePoll()">Delete Poll</button>
            </div>
          </div>
        }
      </div>

      <div class="results-section card">
        <h3>Results</h3>
        @if (results().length > 0) {
          <div class="results-list">
            @for (r of results(); track r.optionId) {
              <div class="result-item">
                <div class="result-label">
                  <span>{{ r.text }}</span>
                  <span class="result-count">{{ r.count }} vote{{ r.count !== 1 ? 's' : '' }}</span>
                </div>
                <div class="result-bar-track">
                  <div class="result-bar-fill" [style.width.%]="(r.count / maxCount()) * 100"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="no-results">No votes yet</p>
        }
      </div>
    }
  `,
  styles: [`
    .back-link { display: inline-flex; align-items: center; gap: 0.25rem; color: var(--color-muted); text-decoration: none; font-size: 0.8125rem; margin-bottom: 0.5rem; }
    .back-link:hover { color: var(--color-ink); }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--color-ink); margin: 0; }
    .page-subtitle { color: var(--color-muted); margin: 0.25rem 0 0; font-size: 0.875rem; }
    .poll-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .poll-status { font-size: 0.75rem; font-weight: 600; padding: 0.125rem 0.5rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
    .poll-status.open { background: color-mix(in srgb, #22c55e 12%, transparent); color: #22c55e; }
    .poll-status.closed { background: color-mix(in srgb, #6b7280 12%, transparent); color: #6b7280; }
    .tag { font-size: 0.75rem; font-weight: 500; padding: 0.125rem 0.5rem; border-radius: 999px; background: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary); }
    .meta-item { font-size: 0.8125rem; color: var(--color-muted); }
    .poll-actions { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 1.5rem; }
    .vote-section, .manage-section, .results-section { padding: 1.5rem; }
    .vote-section h3, .manage-section h3, .results-section h3 { font-size: 1rem; font-weight: 600; margin: 0 0 1rem; }
    .options-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
    .option-btn { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--color-border); border-radius: 0.5rem; background: var(--color-bg); cursor: pointer; font-size: 0.875rem; color: var(--color-ink); transition: all 0.15s; text-align: left; }
    .option-btn:hover { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 6%, transparent); }
    .option-btn.selected { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 10%, transparent); }
    .option-text { flex: 1; }
    .manage-actions { display: flex; gap: 0.75rem; }
    .results-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .result-item { }
    .result-label { display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.25rem; color: var(--color-ink); }
    .result-count { color: var(--color-muted); }
    .result-bar-track { height: 8px; background: var(--color-bg-secondary); border-radius: 999px; overflow: hidden; }
    .result-bar-fill { height: 100%; background: var(--color-primary); border-radius: 999px; transition: width 0.3s ease; min-width: 4px; }
    .no-results { text-align: center; color: var(--color-muted); padding: 2rem; }
    .loading-state, .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 3rem; margin: 0 0 1rem; }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PollDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pollsService = inject(PollsService);

  protected readonly poll = signal<Poll | null>(null);
  protected readonly results = signal<VoteResult[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly voting = signal(false);
  protected readonly totalVotes = signal(0);
  protected readonly canVote = signal(true);
  protected readonly maxCount = signal(1);

  private pollId = 0;

  ngOnInit() {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPoll();
  }

  protected currentUserId(): number {
    const token = localStorage.getItem('teampolls_token');
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return 0;
    }
  }

  protected async loadPoll() {
    this.loading.set(true);
    this.error.set('');
    try {
      const poll = await lastValueFrom(this.pollsService.getById(this.pollId));
      this.poll.set(poll);

      const [results, voteStatus] = await Promise.all([
        lastValueFrom(this.pollsService.getResults(this.pollId)),
        lastValueFrom(this.pollsService.getVoteStatus(this.pollId)),
      ]);

      this.results.set(results);
      this.totalVotes.set(results.reduce((sum, r) => sum + r.count, 0));
      this.maxCount.set(Math.max(...results.map(r => r.count), 1));
      this.canVote.set(!voteStatus);
      if (voteStatus) {
        this.selectedOption.set(voteStatus.optionId);
      }
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to load poll');
    } finally {
      this.loading.set(false);
    }
  }

  protected selectOption(optionId: number) {
    this.selectedOption.set(optionId);
  }

  protected async castVote() {
    const optionId = this.selectedOption();
    if (!optionId) return;
    this.voting.set(true);
    try {
      await lastValueFrom(this.pollsService.castVote(this.pollId, optionId));
      this.canVote.set(false);
      await this.loadPoll();
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to cast vote');
    } finally {
      this.voting.set(false);
    }
  }

  protected async closePoll() {
    try {
      await lastValueFrom(this.pollsService.close(this.pollId));
      await this.loadPoll();
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to close poll');
    }
  }

  protected async reopenPoll() {
    try {
      await lastValueFrom(this.pollsService.reopen(this.pollId));
      await this.loadPoll();
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to reopen poll');
    }
  }

  protected async deletePoll() {
    if (!confirm('Are you sure you want to delete this poll?')) return;
    try {
      await lastValueFrom(this.pollsService.remove(this.pollId));
      window.location.href = '/dashboard';
    } catch (err: any) {
      this.error.set(err.error?.message || 'Failed to delete poll');
    }
  }
}
