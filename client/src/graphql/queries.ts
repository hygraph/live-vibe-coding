import { gql } from '@apollo/client';

// Comment fragment for reusable comment fields
export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    snippetId
    author
    content
    createdAt
    updatedAt
  }
`;

// Snippet fragment for reusable snippet fields
export const SNIPPET_FRAGMENT = gql`
  fragment SnippetFields on Snippet {
    id
    title
    language
    content
    createdAt
    updatedAt
  }
`;

// Snippet fragment with comments
export const SNIPPET_WITH_COMMENTS_FRAGMENT = gql`
  ${COMMENT_FRAGMENT}
  fragment SnippetWithCommentsFields on Snippet {
    id
    title
    language
    content
    createdAt
    updatedAt
    comments {
      ...CommentFields
    }
  }
`;

// Query to get all snippets with optional filtering
export const GET_SNIPPETS = gql`
  ${SNIPPET_FRAGMENT}
  query GetSnippets($search: String, $language: String) {
    snippets(search: $search, language: $language) {
      ...SnippetFields
    }
  }
`;

// Query to get a single snippet by ID with comments
export const GET_SNIPPET = gql`
  ${SNIPPET_WITH_COMMENTS_FRAGMENT}
  query GetSnippet($id: ID!) {
    snippet(id: $id) {
      ...SnippetWithCommentsFields
    }
  }
`;

// Query to get comments for a specific snippet
export const GET_COMMENTS = gql`
  ${COMMENT_FRAGMENT}
  query GetComments($snippetId: ID!) {
    comments(snippetId: $snippetId) {
      ...CommentFields
    }
  }
`;

// Mutation to create a new snippet
export const CREATE_SNIPPET = gql`
  ${SNIPPET_FRAGMENT}
  mutation CreateSnippet($input: CreateSnippetInput!) {
    createSnippet(input: $input) {
      ...SnippetFields
    }
  }
`;

// Mutation to update an existing snippet
export const UPDATE_SNIPPET = gql`
  ${SNIPPET_FRAGMENT}
  mutation UpdateSnippet($id: ID!, $input: UpdateSnippetInput!) {
    updateSnippet(id: $id, input: $input) {
      ...SnippetFields
    }
  }
`;

// Mutation to delete a snippet
export const DELETE_SNIPPET = gql`
  mutation DeleteSnippet($id: ID!) {
    deleteSnippet(id: $id)
  }
`;

// Mutation to create a new comment
export const CREATE_COMMENT = gql`
  ${COMMENT_FRAGMENT}
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFields
    }
  }
`;

// Mutation to delete a comment
export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;
