export const typeDefs = `#graphql
  # Snippet type representing a code snippet
  type Snippet {
    id: ID!
    title: String!
    language: String
    code: String!
    description: String
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
  }

  # Comment type representing a comment on a snippet
  type Comment {
    id: ID!
    snippetId: ID!
    author: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  # Input types for mutations
  input CreateSnippetInput {
    title: String!
    language: String
    code: String!
    description: String
  }

  input UpdateSnippetInput {
    title: String
    language: String
    code: String
    description: String
  }

  input CreateCommentInput {
    snippetId: ID!
    author: String!
    content: String!
  }

  # Query operations
  type Query {
    # Get all snippets with optional search and language filtering
    snippets(search: String, language: String): [Snippet!]!
    
    # Get a single snippet by ID
    snippet(id: ID!): Snippet

    # Get comments for a specific snippet
    comments(snippetId: ID!): [Comment!]!
  }

  # Mutation operations
  type Mutation {
    # Create a new snippet
    createSnippet(input: CreateSnippetInput!): Snippet

    # Update an existing snippet
    updateSnippet(id: ID!, input: UpdateSnippetInput!): Snippet

    # Delete a snippet
    deleteSnippet(id: ID!): Boolean

    # Create a new comment
    createComment(input: CreateCommentInput!): Comment

    # Delete a comment
    deleteComment(id: ID!): Boolean
  }
`;
