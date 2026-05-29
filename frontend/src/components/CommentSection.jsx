import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentSection({ issueId, comments, onCommentAdded }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await api.post(`/issues/${issueId}/comments`, { content: content.trim() });
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(response.data.comment);
      }
    } catch (err) {
      setError('Greška pri dodavanju komentara.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Komentari</h3>

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {comment.first_name || comment.user?.first_name}{' '}
                  {comment.last_name || comment.user?.last_name || ''}
                </span>
                <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
              </div>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Nema komentara.</p>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Napišite komentar..."
            maxLength={1000}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Slanje...' : 'Dodaj komentar'}
          </button>
        </form>
      )}
    </div>
  );
}
