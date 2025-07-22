import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GET_SNIPPET, DELETE_SNIPPET, GET_SNIPPETS } from '../graphql/queries';
import type {
  GetSnippetData,
  GetSnippetVariables,
  DeleteSnippetData,
  DeleteSnippetVariables,
} from '../graphql/types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import '../styles/snippets.css';

const SnippetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { loading, error, data } = useQuery<
    GetSnippetData,
    GetSnippetVariables
  >(GET_SNIPPET, {
    variables: { id: id! },
    skip: !id,
  });

  const [deleteSnippet, { loading: deleting }] = useMutation<
    DeleteSnippetData,
    DeleteSnippetVariables
  >(DELETE_SNIPPET, {
    onCompleted: () => {
      navigate('/');
    },
    onError: error => {
      console.error('Error deleting snippet:', error);
      alert('Error deleting snippet. Please try again.');
    },
    // Update cache to remove deleted snippet
    update: cache => {
      try {
        const existingData = cache.readQuery<{ snippets: Array<unknown> }>({
          query: GET_SNIPPETS,
          variables: {},
        });

        if (existingData) {
          cache.writeQuery({
            query: GET_SNIPPETS,
            variables: {},
            data: {
              snippets: existingData.snippets.filter(
                (snippet: any) => (snippet as any).id !== id
              ),
            },
          });
        }
      } catch {
        // Query might not exist in cache, which is fine
      }

      // Remove the specific snippet from cache
      cache.evict({
        id: cache.identify({ __typename: 'Snippet', id }),
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } catch {
        console.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      await deleteSnippet({
        variables: { id },
      });
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className='loading'>
        <div className='spinner'></div>
        Loading snippet...
      </div>
    );
  }

  if (error) {
    return (
      <div className='error'>
        Error loading snippet: {error.message}
        <Link
          to='/'
          className='btn btn-secondary'
          style={{ marginLeft: '1rem' }}
        >
          Back to List
        </Link>
      </div>
    );
  }

  if (!data?.snippet) {
    return (
      <div className='error'>
        Snippet not found
        <Link
          to='/'
          className='btn btn-secondary'
          style={{ marginLeft: '1rem' }}
        >
          Back to List
        </Link>
      </div>
    );
  }

  const { snippet } = data;

  return (
    <div className='snippet-detail'>
      <div className='snippet-detail-header'>
        <h1 className='snippet-detail-title'>{snippet.title}</h1>

        <div className='snippet-detail-meta'>
          {snippet.language && (
            <span className='snippet-language'>{snippet.language}</span>
          )}
          <span>Created {formatDate(snippet.createdAt)}</span>
          <span>Updated {formatDate(snippet.updatedAt)}</span>
        </div>

        <div className='snippet-detail-actions'>
          <button
            className={`copy-button ${copyStatus === 'copied' ? 'copied' : ''}`}
            onClick={() => copyToClipboard(snippet.code)}
            disabled={false}
          >
            {copyStatus === 'copied' ? (
              <>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                >
                  <polyline points='20,6 9,17 4,12'></polyline>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                >
                  <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
                  <path d='M5,15H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H15a2,2,0,0,1,2,2V5'></path>
                </svg>
                Copy Code
              </>
            )}
          </button>

          <Link to={`/edit/${snippet.id}`} className='btn btn-primary'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
              <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
            </svg>
            Edit
          </Link>

          {showDeleteConfirm ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className='btn btn-danger btn-sm'
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                className='btn btn-secondary btn-sm'
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className='btn btn-danger' onClick={handleDeleteClick}>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <polyline points='3,6 5,6 21,6'></polyline>
                <path d='M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6'></path>
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>

      <div className='snippet-detail-body'>
        {snippet.description && (
          <div className='snippet-detail-description'>
            {snippet.description}
          </div>
        )}

        <div className='code-section'>
          <div className='code-header'>
            <h4>Code</h4>
            <button
              className={`copy-button ${copyStatus === 'copied' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(snippet.code)}
            >
              {copyStatus === 'copied' ? (
                <>
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                  >
                    <polyline points='20,6 9,17 4,12'></polyline>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                  >
                    <rect
                      x='9'
                      y='9'
                      width='13'
                      height='13'
                      rx='2'
                      ry='2'
                    ></rect>
                    <path d='M5,15H4a2,2,0,0,1-2,2V4A2,2,0,0,1,4,2H15a2,2,0,0,1,2,2V5'></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className='code-block'>{snippet.code}</div>
        </div>

        <div className='comments-section'>
          <CommentList
            comments={snippet.comments || []}
            snippetId={snippet.id}
          />
          <CommentForm snippetId={snippet.id} />
        </div>
      </div>
    </div>
  );
};

export default SnippetDetail;
