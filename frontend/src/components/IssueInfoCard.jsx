const statusConfig = {
  reported: { label: 'Prijavljeno', color: 'bg-orange-500' },
  in_progress: { label: 'U tijeku', color: 'bg-blue-600' },
  resolved: { label: 'Riješeno', color: 'bg-green-500' },
  rejected: { label: 'Odbijeno', color: 'bg-gray-500' },
};

export default function IssueInfoCard({ issue, onClose, onDetailsClick }) {
  const statusInfo = statusConfig[issue.status] || statusConfig.reported;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none"
        aria-label="Zatvori"
      >
        &times;
      </button>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-base pr-6 mb-2">{issue.title}</h3>

      {/* Category */}
      {issue.category && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="mr-1">{issue.category.icon}</span>
          <span>{issue.category.name}</span>
        </div>
      )}

      {/* Status badge */}
      <span className={`inline-block px-2 py-1 rounded text-xs text-white font-medium ${statusInfo.color} mb-3`}>
        {statusInfo.label}
      </span>

      {/* Photo thumbnail */}
      {issue.photo_urls && issue.photo_urls.length > 0 && (
        <div className="mb-3 relative">
          <img
            src={issue.photo_urls[0]}
            alt={issue.title}
            className="w-full h-24 object-cover rounded"
          />
          {issue.photo_urls.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              +{issue.photo_urls.length - 1}
            </span>
          )}
        </div>
      )}

      {/* Details button */}
      <button
        onClick={() => onDetailsClick(issue)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
      >
        Detalji
      </button>
    </div>
  );
}
