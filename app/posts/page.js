 'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth';
import {
  createPost,
  getAllPosts,
  deletePost,
} from '@/services/database';

export default function PostsPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkUserAndLoadPosts();
  }, []);

  const checkUserAndLoadPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const userResult = await getCurrentUser();

      if (userResult.success) {
        setUser(userResult.user);
        await loadPosts();
      } else {
        setError('Please login first.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user.');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const result = await getAllPosts();

      if (result.success) {
        setPosts(result.posts || []);
      } else {
        setError(result.error || 'Failed to load posts.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load posts.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPost.trim() || !user) return;

    setPosting(true);
    setError('');
    setSuccess('');

    try {
      const result = await createPost(
        user.id,
        user.email,
        user.name,
        newPost.trim()
      );

      if (result.success) {
        setNewPost('');
        setSuccess('Post created successfully!');
        await loadPosts();
      } else {
        setError(result.error || 'Failed to create post.');
      }
    } catch (err) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (!confirmed) return;

    setDeletingPost(postId);
    setError('');
    setSuccess('');

    try {
      const result = await deletePost(postId);

      if (result.success) {
        setPosts((currentPosts) =>
          currentPosts.filter(
            (post) => post.$id !== postId && post.id !== postId
          )
        );
        setSuccess('Post deleted successfully!');
      } else {
        setError(result.error || 'Failed to delete post.');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete post.');
    } finally {
      setDeletingPost(null);
    }
  };

  if (loading) {
    return (
      <main style={styles.container}>
        <p>Loading posts...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={styles.container}>
        <h1>Hawaasummaa Posts</h1>
        <p>Please log in to view and create posts.</p>
        {error && <p style={styles.error}>{error}</p>}
        <a href="/login" style={styles.link}>
          Go to Login
        </a>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.heading}>Hawaasummaa Posts</h1>
      <p style={styles.welcome}>
        Welcome, {user.name || user.email}!
      </p>

      <form onSubmit={handleCreatePost} style={styles.form}>
        <label htmlFor="newPost" style={styles.label}>
          Write a post
        </label>

        <textarea
          id="newPost"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What is on your mind?"
          rows={4}
          maxLength={2000}
          required
          style={styles.textarea}
        />

        <button
          type="submit"
          disabled={posting || !newPost.trim()}
          style={styles.button}
        >
          {posting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>

      {error && <p role="alert" style={styles.error}>{error}</p>}
      {success && <p role="status" style={styles.success}>{success}</p>}

      <section style={styles.postsSection}>
        <h2>Recent Posts</h2>

        {posts.length === 0 ? (
          <p>No posts yet. Be the first to write one!</p>
        ) : (
          posts.map((post) => {
            const postId = post.$id || post.id;

            return (
              <article key={postId} style={styles.postCard}>
                <h3>{post.userName || post.name || 'User'}</h3>
                <p style={styles.email}>
                  {post.userEmail || post.email || ''}
                </p>
                <p style={styles.postContent}>
                  {post.content || post.text || post.body || ''}
                </p>

                <button
                  type="button"
                  onClick={() => handleDeletePost(postId)}
                  disabled={deletingPost === postId}
                  style={styles.deleteButton}
                >
                  {deletingPost === postId ? 'Deleting...' : 'Delete Post'}
                </button>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: '760px',
    margin: '40px auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    color: '#222',
  },
  heading: {
    color: '#2563eb',
    marginBottom: '8px',
  },
  welcome: {
    color: '#555',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  label: {
    fontWeight: 'bold',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    resize: 'vertical',
  },
  button: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  postsSection: {
    marginTop: '28px',
  },
  postCard: {
    padding: '18px',
    marginTop: '16px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    overflowWrap: 'anywhere',
  },
  email: {
    color: '#666',
    fontSize: '13px',
  },
  postContent: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
  },
  deleteButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    padding: '10px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderRadius: '6px',
  },
  success: {
    padding: '10px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '6px',
  },
  link: {
    color: '#2563eb',
  },
};