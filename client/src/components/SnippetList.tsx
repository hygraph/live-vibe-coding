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

  const truncateCode = (code: string, maxLength: number = 200) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + '...';
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
    <div>
      {/* Search and Filters */}
      <div className='search-filters'>
        <div className='search-group'>
          <label htmlFor='search' className='form-label'>
            Search snippets
          </label>
          <div className='search-input'>
            <svg
              className='search-icon'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <input
              id='search'
              type='text'
              placeholder='Search by title or code...'
              className='form-input'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className='filter-group'>
          <div className='form-group'>
            <label htmlFor='language' className='form-label'>
              Filter by language
            </label>
            <select
              id='language'
              className='form-select'
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
            >
              <option value=''>All languages</option>
              {PROGRAMMING_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        {snippets.length} snippet{snippets.length !== 1 ? 's' : ''} found
      </div>

      {/* Snippet List */}
      {snippets.length === 0 ? (
        <div className='empty-state'>
          <h3>No snippets found</h3>
          <p>
            {search || languageFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first code snippet!'}
          </p>
          <Link to='/new' className='btn btn-primary'>
            Create First Snippet
          </Link>
        </div>
      ) : (
        <div className='snippet-list'>
          {snippets.map(snippet => (
            <div
              key={snippet.id}
              className='snippet-card'
              onClick={() => handleSnippetClick(snippet)}
            >
              <div className='snippet-card-header'>
                <h3 className='snippet-card-title'>{snippet.title}</h3>
                <div className='snippet-card-meta'>
                  {snippet.language && (
                    <span className='snippet-language'>{snippet.language}</span>
                  )}
                  <span>Updated {formatDate(snippet.updatedAt)}</span>
                </div>
              </div>

              <div className='snippet-card-body'>
                {snippet.description && (
                  <p className='snippet-description'>{snippet.description}</p>
                )}
                <div className='snippet-preview'>
                  <CodeBlock
                    code={truncateCode(snippet.code)}
                    language={snippet.language}
                    showLineNumbers={false}
                    theme='dark'
                    className='snippet-preview-code'
                  />
                </div>
              </div>

              <div className='snippet-card-footer'>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Created {formatDate(snippet.createdAt)}
                </span>
                <div className='snippet-actions'>
                  <Link
                    to={`/snippet/${snippet.id}`}
                    className='btn btn-secondary btn-sm'
                    onClick={e => e.stopPropagation()}
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit/${snippet.id}`}
                    className='btn btn-primary btn-sm'
                    onClick={e => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnippetList;
