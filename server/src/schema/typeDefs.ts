import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type Query {
    me: User
    workspace(id: ID!): Workspace
    reviews(workspaceId: ID!, status: ReviewStatus): [Review!]!
    review(id: ID!): Review
    snippets(authorId: ID, language: String): [Snippet!]!
    snippet(id: ID!): Snippet
  }

  type Mutation {
    createWorkspace(name: String!, description: String): Workspace!
    inviteMember(workspaceId: ID!, email: String!, role: MemberRole!): WorkspaceMember!

    createReview(input: CreateReviewInput!): Review!
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!

    addComment(reviewId: ID!, lineNumber: Int!, filePath: String!, body: String!, replyToId: ID): Comment!
    updateComment(id: ID!, body: String!): Comment!
    deleteComment(id: ID!): Boolean!
    resolveComment(id: ID!): Comment!

    submitReview(reviewId: ID!, decision: Decision!): Review!

    createSnippet(input: CreateSnippetInput!): Snippet!
    deleteSnippet(id: ID!): Boolean!
  }

  type Subscription {
    commentAdded(reviewId: ID!): Comment!
    reviewUpdated(reviewId: ID!): Review!
  }

  type User {
    id: ID!
    name: String
    email: String!
    avatar: String
    workspaces: [WorkspaceMember!]!
    createdAt: DateTime!
  }

  type Workspace {
    id: ID!
    name: String!
    description: String
    members: [WorkspaceMember!]!
    reviews: [Review!]!
    createdAt: DateTime!
  }

  type WorkspaceMember {
    id: ID!
    user: User!
    workspace: Workspace!
    role: MemberRole!
    joinedAt: DateTime!
  }

  type Review {
    id: ID!
    title: String!
    description: String
    diff: String!
    filePaths: [String!]!
    status: ReviewStatus!
    decision: Decision
    author: User!
    reviewers: [User!]!
    comments: [Comment!]!
    workspace: Workspace!
    baseRef: String
    headRef: String
    githubPrUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    body: String!
    lineNumber: Int!
    filePath: String!
    author: User!
    review: Review!
    replies: [Comment!]!
    replyTo: Comment
    resolved: Boolean!
    resolvedBy: User
    resolvedAt: DateTime
    createdAt: DateTime!
  }

  type Snippet {
    id: ID!
    title: String!
    code: String!
    language: String!
    description: String
    author: User!
    shareUrl: String!
    expiresAt: DateTime
    createdAt: DateTime!
  }

  input CreateReviewInput {
    workspaceId: ID!
    title: String!
    description: String
    diff: String!
    filePaths: [String!]!
    reviewerIds: [ID!]
    baseRef: String
    headRef: String
  }

  input UpdateReviewInput {
    title: String
    description: String
    status: ReviewStatus
  }

  input CreateSnippetInput {
    title: String!
    code: String!
    language: String!
    description: String
    expiresInHours: Int
  }

  enum ReviewStatus {
    OPEN
    APPROVED
    CHANGES_REQUESTED
    MERGED
    CLOSED
  }

  enum Decision {
    APPROVE
    REQUEST_CHANGES
    COMMENT
  }

  enum MemberRole {
    OWNER
    ADMIN
    REVIEWER
    VIEWER
  }
`;
