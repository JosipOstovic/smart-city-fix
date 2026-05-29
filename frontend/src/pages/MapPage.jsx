import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoWindowF } from '@react-google-maps/api';
import Map from '../components/Map';
import IssueMarker from '../components/IssueMarker';
import IssueInfoCard from '../components/IssueInfoCard';
import FilterPanel from '../components/FilterPanel';
import { issueAPI } from '../services/issueService';

export default function MapPage() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
    category_id: '',
    status: '',
    date_from: '',
    date_to: '',
  });
  const [loading, setLoading] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await issueAPI.fetchCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch issues when filters change
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.status) params.status = filters.status;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;

      const res = await issueAPI.fetchIssues(params);
      setIssues(res.data.issues || []);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleInfoClose = () => {
    setSelectedIssue(null);
  };

  const handleDetailsClick = (issue) => {
    navigate(`/issues/${issue.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedIssue(null);
  };

  return (
    <div className="h-[calc(100vh-64px)] relative flex">
      {/* Desktop filter panel */}
      <div className="hidden md:block w-72 flex-shrink-0 overflow-y-auto p-4 bg-gray-50 border-r border-gray-200">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />
        {loading && (
          <p className="mt-4 text-sm text-gray-500 text-center">Učitavanje...</p>
        )}
        <p className="mt-4 text-xs text-gray-400 text-center">
          {issues.length} problema na karti
        </p>
      </div>

      {/* Mobile filter toggle button */}
      <button
        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
        className="md:hidden absolute top-4 left-4 z-20 bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filteri
      </button>

      {/* Mobile filter panel overlay */}
      {filterPanelOpen && (
        <div className="md:hidden absolute inset-0 z-30 flex">
          <div className="w-72 bg-white shadow-xl overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Filteri</h3>
              <button
                onClick={() => setFilterPanelOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setFilterPanelOpen(false)}
          />
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative">
        <Map>
          {issues.map((issue) => (
            <IssueMarker
              key={issue.id}
              issue={issue}
              onClick={handleMarkerClick}
            />
          ))}

          {selectedIssue && (
            <InfoWindowF
              position={{
                lat: parseFloat(selectedIssue.latitude),
                lng: parseFloat(selectedIssue.longitude),
              }}
              onCloseClick={handleInfoClose}
            >
              <IssueInfoCard
                issue={selectedIssue}
                onClose={handleInfoClose}
                onDetailsClick={handleDetailsClick}
              />
            </InfoWindowF>
          )}
        </Map>
      </div>
    </div>
  );
}
