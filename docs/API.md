# TeamPolls API Reference

Base URL: `http://localhost:3000/api`
Swagger Docs: `http://localhost:3000/api/docs`

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### POST /api/auth/register
Create a new user account.

```json
{ "username": "johndoe", "email": "john@example.com", "password": "password123" }
```
Response:
```json
{ "token": "eyJ...", "user": { "id": 1, "username": "johndoe", "email": "john@example.com" } }
```

### POST /api/auth/login
Authenticate with email and password.

```json
{ "email": "john@example.com", "password": "password123" }
```
Response:
```json
{ "token": "eyJ...", "user": { "id": 1, "username": "johndoe", "email": "john@example.com" } }
```

### GET /api/auth/me 🔐
Get current user profile.

Response:
```json
{ "id": 1, "username": "johndoe", "email": "john@example.com", "createdAt": "2026-07-29T..." }
```

## Polls

### GET /api/polls 🔐
List all polls for the authenticated user. Returns with options.

### GET /api/polls/:id 🔐
Get a poll by ID with options and creator info.

### POST /api/polls 🔐
Create a new poll with options.

```json
{
  "title": "What tech stack?",
  "description": "We need to decide on a frontend framework",
  "deadline": "2026-08-05T23:59:00Z",
  "isAnonymous": false,
  "options": ["React", "Vue", "Svelte"]
}
```

### POST /api/polls/:id/close 🔐
Close a poll (creator only). Prevents further voting.

### POST /api/polls/:id/reopen 🔐
Reopen a closed poll (creator only).

### DELETE /api/polls/:id 🔐
Delete a poll (creator only).

## Votes

### POST /api/votes 🔐
Cast a vote on a poll.

```json
{ "pollId": 1, "optionId": 2 }
```
Response: 201 Created on success.
Errors: 409 Conflict (already voted), 400 Bad Request (poll closed), 404 Not Found (invalid option)

### GET /api/votes/results/:pollId 🔐
Get vote results for a poll.

Response:
```json
[
  { "optionId": 1, "text": "React", "count": 3 },
  { "optionId": 2, "text": "Vue", "count": 1 },
  { "optionId": 3, "text": "Svelte", "count": 2 }
]
```

### GET /api/votes/status/:pollId 🔐
Check if the current user has voted.

Response (has voted): `{ "optionId": 2 }`
Response (not voted): `null`

## Error Responses

All errors follow this format:
```json
{ "message": "Error description", "error": "Error type", "statusCode": 400 }
```

Common status codes:
- 400: Bad Request (validation error, poll closed)
- 401: Unauthorized (missing/invalid token)
- 404: Not Found
- 409: Conflict (duplicate vote, duplicate email)
