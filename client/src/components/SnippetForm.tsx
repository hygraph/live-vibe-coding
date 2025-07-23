import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import {
  CREATE_SNIPPET,
  UPDATE_SNIPPET,
  GET_SNIPPET,
  GET_SNIPPETS,
} from '../graphql/queries';
import type {
  CreateSnippetData,
  CreateSnippetVariables,
  UpdateSnippetData,
  UpdateSnippetVariables,
  GetSnippetData,
  GetSnippetVariables,
  CreateSnippetInput,
} from '../graphql/types';
import { PROGRAMMING_LANGUAGES } from '../graphql/types';
import '../styles/snippets.css';

interface SnippetFormProps {
  mode?: 'create' | 'edit';
}

const SnippetForm: React.FC<SnippetFormProps> = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = mode === 'edit' && id;

  const [formData, setFormData] = useState<CreateSnippetInput>({
    title: '',
    language: '',
    content: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query for existing snippet data when editing
  const { data: snippetData, loading: loadingSnippet } = useQuery<
    GetSnippetData,
    GetSnippetVariables
  >(GET_SNIPPET, {
    variables: { id: id! },
    skip: !isEditing,
    onCompleted: data => {
      if (data.snippet) {
        setFormData({
          title: data.snippet.title,
          language: data.snippet.language || '',
          content: data.snippet.content,
        });
      }
    },
  });

  // Create snippet mutation
  const [createSnippet, { loading: creating }] = useMutation<
    CreateSnippetData,
    CreateSnippetVariables
  >(CREATE_SNIPPET, {
    onCompleted: data => {
      navigate(`/snippet/${data.createSnippet.id}`);
    },
    onError: error => {
      console.error('Error creating snippet:', error);
    },
    // Update cache to include new snippet
    update: (cache, { data }) => {
      if (data?.createSnippet) {
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
                snippets: [data.createSnippet, ...existingData.snippets],
              },
            });
          }
        } catch {
          // Query might not exist in cache yet, which is fine
        }
      }
    },
  });

  // Update snippet mutation
  const [updateSnippet, { loading: updating }] = useMutation<
    UpdateSnippetData,
    UpdateSnippetVariables
  >(UPDATE_SNIPPET, {
    onCompleted: data => {
      navigate(`/snippet/${data.updateSnippet.id}`);
    },
    onError: error => {
      console.error('Error updating snippet:', error);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateSnippet({
          variables: {
            id: id!,
            input: {
              title: formData.title.trim(),
              language: formData.language || undefined,
              content: formData.content.trim(),
            },
          },
        });
      } else {
        await createSnippet({
          variables: {
            input: {
              title: formData.title.trim(),
              language: formData.language || undefined,
              content: formData.content.trim(),
            },
          },
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field: keyof CreateSnippetInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loadingSnippet) {
    return (
      <div className='loading'>
        <div className='spinner'></div>
        Loading snippet...
      </div>
    );
  }

  if (isEditing && !snippetData?.snippet) {
    return <div className='error'>Snippet not found</div>;
  }

  const isLoading = creating || updating;

  return (
    <div className='snippet-form'>
      <h2>{isEditing ? 'Edit Snippet' : 'Create New Snippet'}</h2>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title' className='form-label'>
            Title *
          </label>
          <input
            id='title'
            type='text'
            className={`form-input ${errors.title ? 'error' : ''}`}
            value={formData.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder='Enter a descriptive title for your snippet'
            disabled={isLoading}
          />
          {errors.title && <div className='error'>{errors.title}</div>}
        </div>

        <div className='form-group'>
          <label htmlFor='language' className='form-label'>
            Programming Language
          </label>
          <select
            id='language'
            className='form-select'
            value={formData.language}
            onChange={e => handleChange('language', e.target.value)}
            disabled={isLoading}
          >
            <option value=''>Select a language (optional)</option>
            {PROGRAMMING_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <label className='form-label'>Content * (Markdown supported)</label>
          <div className={`markdown-editor ${errors.content ? 'error' : ''}`}>
            <MDEditor
              value={formData.content}
              onChange={value => handleChange('content', value || '')}
              preview='live'
              visibleDragbar={false}
              height='70vh'
              data-color-mode='light'
            />
          </div>
          {errors.content && <div className='error'>{errors.content}</div>}
          <div className='help-text'>
            Use markdown to format your content. Code blocks support syntax
            highlighting:
            <code>```javascript</code>, <code>```python</code>, etc.
          </div>
        </div>

        <div className='form-actions'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div
                  className='spinner'
                  style={{ width: '16px', height: '16px' }}
                ></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update Snippet'
            ) : (
              'Create Snippet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SnippetForm;
