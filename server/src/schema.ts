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

  # Query operations
  type Query {
    # Get all snippets with optional search and language filtering
    snippets(search: String, language: String): [Snippet!]!
    
    # Get a single snippet by ID
    snippet(id: ID!): Snippet
  }

  # Mutation operations
  type Mutation {
    # Create a new snippet
    createSnippet(input: CreateSnippetInput!): Snippet

    # Update an existing snippet
    updateSnippet(id: ID!, input: UpdateSnippetInput!): Snippet

    # Delete a snippet
    deleteSnippet(id: ID!): Boolean
  }
`;
