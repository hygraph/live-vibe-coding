// Core Snippet type
export interface Snippet {
  id: string;
  title: string;
  language?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

// Comment type
export interface Comment {
  id: string;
  snippetId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Input types for mutations
export interface CreateSnippetInput {
  title: string;
  language?: string;
  content: string;
}

export interface UpdateSnippetInput {
  title?: string;
  language?: string;
  content?: string;
}

export interface CreateCommentInput {
  snippetId: string;
  author: string;
  content: string;
}

// Query variables types
export interface GetSnippetsVariables {
  search?: string;
  language?: string;
}

export interface GetSnippetVariables {
  id: string;
}

export interface GetCommentsVariables {
  snippetId: string;
}

export interface CreateSnippetVariables {
  input: CreateSnippetInput;
}

export interface UpdateSnippetVariables {
  id: string;
  input: UpdateSnippetInput;
}

export interface DeleteSnippetVariables {
  id: string;
}

export interface CreateCommentVariables {
  input: CreateCommentInput;
}

export interface DeleteCommentVariables {
  id: string;
}

// Query response types
export interface GetSnippetsData {
  snippets: Snippet[];
}

export interface GetSnippetData {
  snippet: Snippet | null;
}

export interface GetCommentsData {
  comments: Comment[];
}

export interface CreateSnippetData {
  createSnippet: Snippet;
}

export interface UpdateSnippetData {
  updateSnippet: Snippet;
}

export interface DeleteSnippetData {
  deleteSnippet: boolean;
}

export interface CreateCommentData {
  createComment: Comment;
}

export interface DeleteCommentData {
  deleteComment: boolean;
}

// Common language options for snippets
export const PROGRAMMING_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'r',
  'sql',
  'html',
  'css',
  'scss',
  'less',
  'json',
  'xml',
  'yaml',
  'markdown',
  'bash',
  'powershell',
  'dockerfile',
  'other',
] as const;

export type ProgrammingLanguage = (typeof PROGRAMMING_LANGUAGES)[number];
