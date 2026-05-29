import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import PhotoGallery from '../../components/PhotoGallery';

const STATUS_OPTIONS = [
  { value: 'reported', label: 'Prijavljeno' },
  { value: 'in_progress', label: 'U tijeku' },
  { value: 'resolved', label: 'Riješeno' },
  { value: 'rejected', label: 'Odbijeno' },
];

export default function AdminIssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statusHistory, setStatusHistory] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      const issueData = response.data.issue || response.data;
      setIssue(issueData);
      setNewStatus(issueData.status);
    } catch (err) {
      console.error('Failed to fetch issue:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/issues/${id}/history`);
      setStatusHistory(response.data.history || response.data || []);
    } catch {
      // History endpoint may not be available yet
      setStatusHistory([]);
    }
  };

  useEffect(() => {
    fetchIssue();
    fetchHistory();
  }, [id]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    setSuccessMessage('');
    try {
      await api.patch(`/admin/issues/${id}/status`, { status: newStatus, note: note || undefined });
      setNote('');
      setSuccessMessage('Status uspješno promijenjen!');
      await fetchIssue();
      await fetchHistory();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to change status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/issues/${id}`);
      navigate('/admin/issues');
    } catch (err) {
      console.error('Failed to delete issue:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-6 text-center text-gray-500">
        Prijava nije pronađena.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/admin/issues')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          &larr; Natrag na popis
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Obriši prijavu
        </button>
      </div>

      {/* Issue Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">{issue.title}</h1>
          <StatusBadge status={issue.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Opis</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{issue.description}</p>
          </div>

          <div className="space-y-4">
            {issue.category && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Kategorija</h3>
                <p className="text-gray-800">
                  {issue.category.icon && <span className="mr-1">{issue.category.icon}</span>}
                  {issue.category.name || issue.category}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Prijavitelj</h3>
              <p className="text-gray-800">
                {issue.user?.first_name} {issue.user?.last_name}
                {issue.user?.email && <span className="text-gray-500 ml-1">({issue.user.email})</span>}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Datum prijave</h3>
              <p className="text-gray-800">{formatDate(issue.created_at)}</p>
            </div>
            {(issue.latitude && issue.longitude) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Lokacija</h3>
                <p className="text-gray-800">{issue.latitude}, {issue.longitude}</p>
              </div>
            )}
          </div>
        </div>

        {issue.photo_urls && issue.photo_urls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Fotografije ({issue.photo_urls.length})
            </h3>
            <PhotoGallery urls={issue.photo_urls} alt={issue.title} size="md" />
          </div>
        )}
      </div>

      {/* Status Change */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Promjena statusa</h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleStatusChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Novi status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bilješka (opcionalno)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Dodajte bilješku o promjeni statusa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{note.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={statusLoading || newStatus === issue.status}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {statusLoading ? 'Spremanje...' : 'Promijeni status'}
          </button>
        </form>
      </div>

      {/* Status History */}
      {statusHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Povijest statusa</h2>
          <div className="space-y-4">
            {statusHistory.map((entry, index) => (
              <div key={entry.id || index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  {index < statusHistory.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <StatusBadge status={entry.old_status} />
                    <span className="text-gray-400">&rarr;</span>
                    <StatusBadge status={entry.new_status} />
                  </div>
                  {entry.note && (
                    <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(entry.created_at)}
                    {entry.changed_by_name && ` - ${entry.changed_by_name}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Brisanje prijave"
        message={`Jeste li sigurni da želite obrisati prijavu "${issue.title}"? Ova akcija je nepovratna.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Obriši"
        cancelText="Odustani"
      />
    </div>
  );
}
