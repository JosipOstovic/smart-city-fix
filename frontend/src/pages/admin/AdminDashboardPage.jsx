import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, reported: 0, in_progress: 0, resolved: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, issuesRes] = await Promise.all([
          api.get('/admin/statistics'),
          api.get('/admin/issues', { params: { limit: 5 } }),
        ]);

        const statsData = statsRes.data;
        setStats({
          total: statsData.total || 0,
          reported: statsData.reported || 0,
          in_progress: statsData.in_progress || 0,
          resolved: statsData.resolved || 0,
        });

        const issues = issuesRes.data.issues || issuesRes.data;
        setRecentIssues(Array.isArray(issues) ? issues.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statusLabel = (status) => {
    const labels = {
      reported: 'Prijavljeno',
      in_progress: 'U tijeku',
      resolved: 'Rijeseno',
      rejected: 'Odbijeno',
    };
    return labels[status] || status;
  };

  const statusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-gray-500">Ucitavanje...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Ukupno</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Prijavljeno</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.reported}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">U tijeku</div>
          <div className="text-3xl font-bold text-blue-600">{stats.in_progress}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Rijeseno</div>
          <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Zadnje prijave</h2>
        {recentIssues.length === 0 ? (
          <p className="text-gray-500 text-sm">Nema prijava.</p>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <Link
                key={issue.id}
                to={`/admin/issues/${issue.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(issue.created_at).toLocaleDateString('hr-HR')}
                  </p>
                </div>
                <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(issue.status)}`}>
                  {statusLabel(issue.status)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/issues"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Sve prijave
        </Link>
        <Link
          to="/admin/statistics"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
        >
          Statistika
        </Link>
      </div>
    </div>
  );
}
