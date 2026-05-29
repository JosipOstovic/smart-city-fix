import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, reported: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/users/me/issues');
        setIssues(response.data.issues);
        setStats(response.data.stats);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Ukupno', value: stats.total, color: 'bg-gray-100 text-gray-800' },
    { label: 'Prijavljeno', value: stats.reported, color: 'bg-accent/10 text-accent' },
    { label: 'U tijeku', value: stats.in_progress, color: 'bg-primary/10 text-primary' },
    { label: 'Riješeno', value: stats.resolved, color: 'bg-success/10 text-success' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Moje prijave</h1>
        <Link
          to="/issues/new"
          className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
        >
          Nova prijava
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-4 ${card.color}`}>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Issue List */}
      {issues.length > 0 ? (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => navigate(`/issues/${issue.id}`)}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {issue.category && issue.category.icon && (
                    <span className="text-xl mt-0.5">{issue.category.icon}</span>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800">{issue.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {issue.category && issue.category.name} &middot; {formatDate(issue.created_at)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Nemate prijavljenih problema. Prijavite prvi problem!</p>
          <Link
            to="/issues/new"
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            Nova prijava
          </Link>
        </div>
      )}
    </div>
  );
}
