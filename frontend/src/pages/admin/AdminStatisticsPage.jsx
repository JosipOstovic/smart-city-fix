import api from "../../services/api";
import { useState, useEffect } from "react";
import CategoryChart from "../../components/charts/CategoryChart";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart";
import StatusDistributionChart from "../../components/charts/StatusDistributionChart";
import TopLocationsTable from "../../components/charts/TopLocationsTable";

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/statistics")
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-gray-500">Učitavanje statistike...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-red-500">Greška pri učitavanju statistike.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Statistika</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ukupno</p>
          <p className="text-2xl font-bold">{stats.total_issues}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Prijavljeno</p>
          <p className="text-2xl font-bold text-orange-500">
            {stats.by_status.reported}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">U tijeku</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.by_status.in_progress}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Riješeno</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.by_status.resolved}
          </p>
        </div>
      </div>

      {/* Average resolution time */}
      {stats.avg_resolution_hours !== null && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <p className="text-sm text-gray-500">Prosječno vrijeme rješavanja</p>
          <p className="text-xl font-semibold">
            {stats.avg_resolution_hours} sati
          </p>
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={stats.by_category} />
        <MonthlyTrendChart data={stats.monthly_trend} />
        <StatusDistributionChart data={stats.by_status} />
        <TopLocationsTable data={stats.top_locations} />
      </div>
    </div>
  );
}
