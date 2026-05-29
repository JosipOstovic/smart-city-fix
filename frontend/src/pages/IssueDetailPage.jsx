import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import CommentSection from '../components/CommentSection';
import PhotoGallery from '../components/PhotoGallery';
import Map from '../components/Map';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueRes = await api.get(`/issues/${id}`);
        const issueData = issueRes.data.issue || issueRes.data;
        setIssue(issueData);
        setStatusHistory(issueData.status_history || []);
        setComments(issueData.comments || []);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Problem nije pronađen</h1>
        <p className="text-gray-500 mb-4">Traženi problem ne postoji ili je uklonjen.</p>
        <Link to="/" className="text-primary hover:underline">Povratak na početnu</Link>
      </div>
    );
  }

  const isOwner = user && issue && issue.user_id === user.id;
  const canEdit = isOwner && issue.status === 'reported';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{issue.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {issue.category && (
                <span className="flex items-center gap-1">
                  {issue.category.icon && <span>{issue.category.icon}</span>}
                  {issue.category.name || issue.category_name}
                </span>
              )}
              <span>{formatDate(issue.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={issue.status} />
            {canEdit && (
              <Link
                to={`/issues/${issue.id}/edit`}
                className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Uredi
              </Link>
            )}
          </div>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap mb-4">{issue.description}</p>

        {issue.reporter && (
          <p className="text-sm text-gray-500">
            Prijavio/la: {issue.reporter.first_name || issue.reporter_name} {issue.reporter.last_name || ''}
          </p>
        )}
      </div>

      {/* Photos */}
      {issue.photo_urls && issue.photo_urls.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Fotografije ({issue.photo_urls.length})
          </h2>
          <PhotoGallery urls={issue.photo_urls} alt={issue.title} size="lg" />
        </div>
      )}

      {/* Location / Map */}
      {(issue.latitude || issue.address) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Lokacija</h2>
          {issue.address && (
            <p className="text-sm text-gray-600 mb-3">{issue.address}</p>
          )}
          {issue.latitude && issue.longitude && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <Map
                center={{ lat: parseFloat(issue.latitude), lng: parseFloat(issue.longitude) }}
                zoom={16}
              />
            </div>
          )}
        </div>
      )}

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Povijest statusa</h2>
        <StatusTimeline history={statusHistory} />
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow p-6">
        <CommentSection
          issueId={id}
          comments={comments}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
}
