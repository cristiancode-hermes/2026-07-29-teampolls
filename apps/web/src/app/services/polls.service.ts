import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll, CreatePollPayload, VoteResult } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class PollsService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiUrl}/polls`);
  }

  getById(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiUrl}/polls/${id}`);
  }

  create(dto: CreatePollPayload): Observable<Poll> {
    return this.http.post<Poll>(`${this.apiUrl}/polls`, dto);
  }

  close(id: number): Observable<Poll> {
    return this.http.post<Poll>(`${this.apiUrl}/polls/${id}/close`, {});
  }

  reopen(id: number): Observable<Poll> {
    return this.http.post<Poll>(`${this.apiUrl}/polls/${id}/reopen`, {});
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/polls/${id}`);
  }

  castVote(pollId: number, optionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/votes`, { pollId, optionId });
  }

  getResults(pollId: number): Observable<VoteResult[]> {
    return this.http.get<VoteResult[]>(`${this.apiUrl}/votes/results/${pollId}`);
  }

  getVoteStatus(pollId: number): Observable<{ optionId: number } | null> {
    return this.http.get<{ optionId: number } | null>(`${this.apiUrl}/votes/status/${pollId}`);
  }
}
