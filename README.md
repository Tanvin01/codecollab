# CodeCollab — Developer Code Review Platform

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Apollo](https://img.shields.io/badge/Apollo_Server-311C87?style=for-the-badge&logo=apollographql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A GitHub-integrated code review and collaboration tool. Submit pull request-style diffs, get inline comments, track review cycles, and collaborate asynchronously.

## ✨ Features

- **Code Diff Viewer** — Side-by-side and unified diff with syntax highlighting (Prism.js)
- **Inline Comments** — Line-level comments with threading and reactions
- **Review Cycles** — Approve / Request Changes / Comment review states
- **GraphQL API** — Strongly typed API with real-time subscriptions
- **GitHub Integration** — Sync PRs from GitHub repos via GitHub App
- **Notification System** — Mention notifications, review requests, email digests
- **Snippet Sharing** — Create shareable code snippets with expiry
- **Team Workspaces** — Multi-user workspaces with permission management
- **Code Search** — Full-text search across all submitted code

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| API Client | Apollo Client 3 |
| Styling | Tailwind CSS |
| State | Apollo Client cache + Zustand |
| Backend | Node.js + Apollo Server 4 |
| API | GraphQL (SDL-first) |
| Database | PostgreSQL + Prisma |
| Auth | JWT + Passport.js |
| Real-time | GraphQL Subscriptions (WebSocket) |
| Code Highlighting | Prism.js + diff2html |
| Container | Docker + Docker Compose |

## 🗂 GraphQL Schema (excerpt)

```graphql
type Query {
  reviews(workspaceId: ID!, status: ReviewStatus): [Review!]!
  review(id: ID!): Review
  snippets(authorId: ID): [Snippet!]!
}

type Mutation {
  createReview(input: CreateReviewInput!): Review!
  addComment(reviewId: ID!, lineNumber: Int!, body: String!): Comment!
  submitReview(reviewId: ID!, decision: Decision!): Review!
}

type Subscription {
  commentAdded(reviewId: ID!): Comment!
  reviewUpdated(reviewId: ID!): Review!
}

type Review {
  id: ID!
  title: String!
  diff: String!
  status: ReviewStatus!
  author: User!
  comments: [Comment!]!
  decision: Decision
  createdAt: DateTime!
}

enum ReviewStatus { OPEN APPROVED CHANGES_REQUESTED MERGED }
enum Decision { APPROVE REQUEST_CHANGES COMMENT }
```

## 🚀 Getting Started

```bash
git clone https://github.com/Tanvin01/codecollab.git
cd codecollab
cp .env.example .env
docker-compose up -d
```

Frontend: http://localhost:5173  
GraphQL Playground: http://localhost:4000/graphql

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/codecollab
JWT_SECRET=your-secret
GITHUB_APP_ID=your-github-app-id
GITHUB_APP_PRIVATE_KEY=your-private-key
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```
