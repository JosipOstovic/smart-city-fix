const statusOptions = [
  { value: '', label: 'Svi statusi' },
  { value: 'reported', label: 'Prijavljeno' },
  { value: 'in_progress', label: 'U tijeku' },
  { value: 'resolved', label: 'Riješeno' },
  { value: 'rejected', label: 'Odbijeno' },
];

export default function FilterPanel({ filters, onFilterChange, categories }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onFilterChange({ category_id: '', status: '', date_from: '', date_to: '' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Filteri</h3>

      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
        <select
          value={filters.category_id || ''}
          onChange={(e) => handleChange('category_id', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sve kategorije</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date from */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Od datuma</label>
        <input
          type="date"
          value={filters.date_from || ''}
          onChange={(e) => handleChange('date_from', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date to */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Do datuma</label>
        <input
          type="date"
          value={filters.date_to || ''}
          onChange={(e) => handleChange('date_to', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Clear button */}
      <button
        onClick={handleClear}
        className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 px-4 rounded-md transition-colors"
      >
        Poništi filtere
      </button>
    </div>
  );
}
