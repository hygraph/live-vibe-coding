import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_COMMENT, GET_SNIPPET } from '../graphql/queries';
import type {
  Comment,
  DeleteCommentData,
  DeleteCommentVariables,
} from '../graphql/types';

interface CommentListProps {
  comments: Comment[];
  snippetId: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, snippetId }) => {
  const [deleteComment] = useMutation<
    DeleteCommentData,
    DeleteCommentVariables
  >(DELETE_COMMENT, {
    refetchQueries: [
      {
        query: GET_SNIPPET,
        variables: { id: snippetId },
      },
    ],
    onError: error => {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment. Please try again.');
    },
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

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment({
          variables: { id: commentId },
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  if (comments.length === 0) {
    return (
      <div className='comments-empty'>
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className='comments-list'>
      <h3>Comments ({comments.length})</h3>
      {comments.map(comment => (
        <div key={comment.id} className='comment'>
          <div className='comment-header'>
            <span className='comment-author'>{comment.author}</span>
            <span className='comment-date'>
              {formatDate(comment.createdAt)}
            </span>
            <button
              className='comment-delete'
              onClick={() => handleDeleteComment(comment.id)}
              title='Delete comment'
              aria-label='Delete comment'
            >
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <polyline points='3,6 5,6 21,6'></polyline>
                <path d='M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6'></path>
              </svg>
            </button>
          </div>
          <div className='comment-content'>
            {comment.content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < comment.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
