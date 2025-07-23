import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
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
import 'highlight.js/styles/github-dark.css';

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

  const [deleteSnippet] = useMutation<
    DeleteSnippetData,
    DeleteSnippetVariables
  >(DELETE_SNIPPET, {
    onCompleted: () => {
      navigate('/');
    },
    onError: error => {
      console.error('Error deleting snippet:', error);
    },
    // Update cache to remove deleted snippet
    update: (cache, { data }) => {
      if (data?.deleteSnippet) {
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
                  (snippet: any) => snippet.id !== id
                ),
              },
            });
          }
        } catch {
          // Query might not exist in cache yet, which is fine
        }
      }
    },
  });

  const copyToClipboard = async () => {
    if (!snippet?.content) return;

    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteSnippet({
        variables: { id },
      });
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    return <div className='error'>Error loading snippet: {error.message}</div>;
  }

  if (!data?.snippet) {
    return <div className='error'>Snippet not found</div>;
  }

  const snippet = data.snippet;

  return (
    <div className='snippet-detail'>
      <div className='snippet-header'>
        <div className='snippet-meta'>
          <h1>{snippet.title}</h1>
          <div className='snippet-info'>
            {snippet.language && (
              <span className='language-tag'>{snippet.language}</span>
            )}
            <span className='date'>
              Created {formatDate(snippet.createdAt)}
            </span>
            {snippet.updatedAt !== snippet.createdAt && (
              <span className='date'>
                • Updated {formatDate(snippet.updatedAt)}
              </span>
            )}
          </div>
        </div>

        <div className='snippet-actions'>
          <button
            className='btn btn-secondary btn-sm'
            onClick={copyToClipboard}
            title='Copy content to clipboard'
          >
            {copyStatus === 'copied'
              ? '✓ Copied!'
              : copyStatus === 'error'
                ? '✗ Error'
                : 'Copy'}
          </button>
          <Link to={`/edit/${snippet.id}`} className='btn btn-secondary btn-sm'>
            Edit
          </Link>
          <button
            className='btn btn-danger btn-sm'
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className='snippet-content'>
        <div className='markdown-content'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: ({ className, children, ...props }: any) => {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {snippet.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className='comments-section'>
        <h3>Comments ({snippet.comments?.length || 0})</h3>
        <CommentForm snippetId={snippet.id} />
        <CommentList comments={snippet.comments || []} snippetId={snippet.id} />
      </div>

      {showDeleteConfirm && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>Delete Snippet</h3>
            <p>
              Are you sure you want to delete "{snippet.title}"? This action
              cannot be undone.
            </p>
            <div className='modal-actions'>
              <button
                className='btn btn-secondary'
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className='btn btn-danger' onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetDetail;
