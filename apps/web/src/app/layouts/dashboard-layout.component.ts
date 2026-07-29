import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
            TeamPolls
          </a>
        </div>
        <nav>
          <ul class="sidebar-nav">
            <li>
              <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Dashboard
              </a>
            </li>
            <li>
              <a routerLink="/polls/new" routerLinkActive="active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Poll
              </a>
            </li>
          </ul>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ auth.currentUser()?.username?.charAt(0)?.toUpperCase() }}</div>
            <div class="user-details">
              <span class="user-name">{{ auth.currentUser()?.username }}</span>
              <span class="user-email">{{ auth.currentUser()?.email }}</span>
            </div>
          </div>
          <button class="btn btn-ghost btn-logout" (click)="auth.logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>
      <div class="main-area">
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 260px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .sidebar-header {
      margin-bottom: 2rem;
    }
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-ink);
      text-decoration: none;
    }
    .sidebar-nav {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 0.5rem;
      color: var(--color-muted);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s;
    }
    .sidebar-nav a:hover {
      background: var(--color-bg-secondary);
      color: var(--color-ink);
    }
    .sidebar-nav a.active {
      background: color-mix(in srgb, var(--color-primary) 12%, transparent);
      color: var(--color-primary);
    }
    .sidebar-footer {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    .user-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-ink);
    }
    .user-email {
      font-size: 0.75rem;
      color: var(--color-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn-logout {
      width: 100%;
      justify-content: center;
      font-size: 0.8125rem;
    }
    .main-area {
      flex: 1;
      min-width: 0;
    }
    .main-content {
      padding: 2rem;
      max-width: 1200px;
    }
  `]
})
export class DashboardLayoutComponent {
  protected auth = inject(AuthService);
}
