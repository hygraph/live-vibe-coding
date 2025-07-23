import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT, GET_SNIPPET } from '../graphql/queries';
import type {
  CreateCommentData,
  CreateCommentVariables,
  CreateCommentInput,
} from '../graphql/types';

interface CommentFormProps {
  snippetId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ snippetId }) => {
  const [formData, setFormData] = useState<
    Omit<CreateCommentInput, 'snippetId'>
  >({
    author: '',
    content: '',
  });

  const [createComment, { loading }] = useMutation<
    CreateCommentData,
    CreateCommentVariables
  >(CREATE_COMMENT, {
    refetchQueries: [
      {
        query: GET_SNIPPET,
        variables: { id: snippetId },
      },
    ],
    onCompleted: () => {
      // Reset form after successful submission
      setFormData({
        author: '',
        content: '',
      });
    },
    onError: error => {
      console.error('Error creating comment:', error);
      alert('Error creating comment. Please try again.');
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.content.trim()) {
      alert('Please fill in both author name and comment content.');
      return;
    }

    try {
      await createComment({
        variables: {
          input: {
            snippetId,
            author: formData.author.trim(),
            content: formData.content.trim(),
          },
        },
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className='comment-form'>
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='author'>Your Name</label>
          <input
            type='text'
            id='author'
            name='author'
            value={formData.author}
            onChange={handleInputChange}
            placeholder='Enter your name'
            className='form-input'
            required
            disabled={loading}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='content'>Comment</label>
          <textarea
            id='content'
            name='content'
            value={formData.content}
            onChange={handleInputChange}
            placeholder='Write your comment here...'
            className='form-textarea'
            rows={4}
            required
            disabled={loading}
          />
        </div>

        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? (
            <>
              <div className='spinner-small'></div>
              Adding Comment...
            </>
          ) : (
            'Add Comment'
          )}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
