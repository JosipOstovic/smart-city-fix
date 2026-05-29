const statusLabels = {
  reported: 'Prijavljeno',
  in_progress: 'U tijeku',
  resolved: 'Riješeno',
  rejected: 'Odbijeno',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StatusTimeline({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-gray-500 text-sm">Nema promjena statusa.</p>;
  }

  return (
    <div className="relative border-l-2 border-primary ml-3">
      {history.map((entry, index) => (
        <div key={entry.id || index} className="relative pl-6 pb-6 last:pb-0">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
          <div className="text-sm text-gray-500 mb-1">{formatDate(entry.created_at)}</div>
          <div className="text-sm font-medium text-gray-800">
            Status promijenjen: {statusLabels[entry.old_status] || entry.old_status} &rarr;{' '}
            {statusLabels[entry.new_status] || entry.new_status}
          </div>
          <div className="text-sm text-gray-500">
            {entry.changed_by_name} {entry.changed_by_last_name}
          </div>
          {entry.note && (
            <div className="text-sm text-gray-600 mt-1 italic">{entry.note}</div>
          )}
        </div>
      ))}
    </div>
  );
}
