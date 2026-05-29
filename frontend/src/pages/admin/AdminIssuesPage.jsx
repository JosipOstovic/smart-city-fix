import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category_id: '', status: '' });
  const [categories, setCategories] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.search) params.search = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.status) params.status = filters.status;

      const response = await api.get('/admin/issues', { params });
      setIssues(response.data.issues);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data.categories || res.data);
    }).catch(() => {});
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/issues/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchIssues();
    } catch (err) {
      console.error('Failed to delete issue:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upravljanje prijavama</h1>
        <p className="text-gray-600 mt-1">Ukupno prijava: {total}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pretraga</label>
            <input
              type="text"
              placeholder="Pretraži po naslovu..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sve kategorije</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Svi statusi</option>
              <option value="reported">Prijavljeno</option>
              <option value="in_progress">U tijeku</option>
              <option value="resolved">Riješeno</option>
              <option value="rejected">Odbijeno</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nema prijava za prikaz.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="table-auto w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naslov</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorija</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Korisnik</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {issues.map(issue => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{issue.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        {issue.category.icon && <span>{issue.category.icon}</span>}
                        {issue.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(issue.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {issue.user.first_name} {issue.user.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/issues/${issue.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Pregledaj
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(issue)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Obriši
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {issues.map(issue => (
              <div key={issue.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm flex-1 mr-2">{issue.title}</h3>
                  <StatusBadge status={issue.status} />
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>{issue.category.icon} {issue.category.name}</p>
                  <p>{issue.user.first_name} {issue.user.last_name} - {formatDate(issue.created_at)}</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/admin/issues/${issue.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Pregledaj
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(issue)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prethodna
              </button>
              <span className="text-sm text-gray-600">
                Stranica {page} od {pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sljedeća
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Brisanje prijave"
        message={`Jeste li sigurni da želite obrisati prijavu "${deleteTarget?.title}"? Ova akcija je nepovratna.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Obriši"
        cancelText="Odustani"
      />
    </div>
  );
}
