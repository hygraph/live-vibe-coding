import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_SNIPPETS } from '../graphql/queries';
import type {
  GetSnippetsData,
  GetSnippetsVariables,
  Snippet,
} from '../graphql/types';
import { PROGRAMMING_LANGUAGES } from '../graphql/types';
import CodeBlock from './CodeBlock';
import '../styles/snippets.css';

interface SnippetListProps {
  onSelectSnippet?: (snippet: Snippet) => void;
}

const SnippetList: React.FC<SnippetListProps> = ({ onSelectSnippet }) => {
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  const { loading, error, data, refetch } = useQuery<
    GetSnippetsData,
    GetSnippetsVariables
  >(GET_SNIPPETS, {
    variables: {
      search: search || undefined,
      language: languageFilter || undefined,
    },
    errorPolicy: 'all',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSnippetClick = (snippet: Snippet) => {
    if (onSelectSnippet) {
      onSelectSnippet(snippet);
    }
  };

  const extractCodeBlock = (content: string) => {
    // Extract first code block with language
    const codeBlockMatch = content.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      return {
        language: codeBlockMatch[1] || 'text',
        code: codeBlockMatch[2].trim(),
      };
    }
    return null;
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    // Remove markdown formatting for text preview
    const plainText = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const renderPreview = (content: string) => {
    const codeBlock = extractCodeBlock(content);
    const textPreview = truncateContent(content, 100);

    return (
      <div className='snippet-preview'>
        {textPreview && <p className='snippet-description'>{textPreview}</p>}
        {codeBlock && (
          <div className='snippet-code-preview'>
            <CodeBlock
              code={codeBlock.code}
              language={codeBlock.language}
              showLineNumbers={false}
              theme='dark'
              className='preview-code'
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='loading'>
        <div className='spinner'></div>
        Loading snippets...
      </div>
    );
  }

  if (error) {
    return (
      <div className='error'>
        Error loading snippets: {error.message}
        <button
          className='btn btn-secondary btn-sm'
          onClick={() => refetch()}
          style={{ marginLeft: '1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const snippets = data?.snippets || [];

  return (
    <div className='snippet-list'>
      <div className='snippet-list-header'>
        <h2>Code Snippets</h2>
        <div className='header-actions'>
          <Link to='/new' className='btn btn-primary'>
            + Create New Snippet
          </Link>
        </div>
      </div>

      <div className='snippet-list-filters'>
        <div className='search-input'>
          <input
            type='text'
            placeholder='Search snippets...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='form-input'
          />
        </div>

        <div className='language-filter'>
          <select
            value={languageFilter}
            onChange={e => setLanguageFilter(e.target.value)}
            className='form-select'
          >
            <option value=''>All Languages</option>
            {PROGRAMMING_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {snippets.length === 0 ? (
        <div className='empty-state'>
          <h3>No snippets found</h3>
          <p>
            {search || languageFilter
              ? 'Try adjusting your search filters.'
              : 'Create your first snippet to get started!'}
          </p>
          <Link to='/new' className='btn btn-primary'>
            Create Snippet
          </Link>
        </div>
      ) : (
        <div className='snippet-grid'>
          {snippets.map(snippet => (
            <div
              key={snippet.id}
              className='snippet-card'
              onClick={() => handleSnippetClick(snippet)}
            >
              <div className='snippet-card-header'>
                <h3>
                  <Link to={`/snippet/${snippet.id}`}>{snippet.title}</Link>
                </h3>
                {snippet.language && (
                  <span className='language-tag'>{snippet.language}</span>
                )}
              </div>

              <div className='snippet-card-content'>
                {renderPreview(snippet.content)}
              </div>

              <div className='snippet-card-footer'>
                <span className='date'>{formatDate(snippet.createdAt)}</span>
                <Link
                  to={`/snippet/${snippet.id}`}
                  className='btn btn-secondary btn-sm'
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnippetList;
