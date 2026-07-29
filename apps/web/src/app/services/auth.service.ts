import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api';
  readonly currentUser = signal<User | null>(null);
  private readonly tokenKey = 'teampolls_token';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = this.getToken();
    if (token) {
      this.getProfile().subscribe({
        next: (res) => this.currentUser.set(res),
        error: () => this.logout(),
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        this.saveToken(res.token);
        this.currentUser.set(res.user);
      }),
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { username, email, password }).pipe(
      tap((res) => {
        this.saveToken(res.token);
        this.currentUser.set(res.user);
      }),
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
