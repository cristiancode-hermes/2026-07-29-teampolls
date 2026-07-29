export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PollOption {
  id: number;
  pollId: number;
  text: string;
}

export interface Poll {
  id: number;
  title: string;
  description: string | null;
  createdById: number;
  createdBy?: User;
  createdAt: string;
  deadline: string | null;
  isAnonymous: boolean;
  status: 'open' | 'closed';
  options: PollOption[];
}

export interface VoteResult {
  optionId: number;
  text: string;
  count: number;
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  deadline?: string;
  isAnonymous?: boolean;
  options: string[];
}
