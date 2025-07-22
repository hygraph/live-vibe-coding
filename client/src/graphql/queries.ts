import { gql } from '@apollo/client';

// Snippet fragment for reusable snippet fields
export const SNIPPET_FRAGMENT = gql`
  fragment SnippetFields on Snippet {
    id
    title
    language
    code
    description
    createdAt
    updatedAt
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

// Query to get a single snippet by ID
export const GET_SNIPPET = gql`
  ${SNIPPET_FRAGMENT}
  query GetSnippet($id: ID!) {
    snippet(id: $id) {
      ...SnippetFields
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
