const statusConfig = {
  reported: { label: 'Prijavljeno', classes: 'bg-accent/10 text-accent' },
  in_progress: { label: 'U tijeku', classes: 'bg-primary/10 text-primary' },
  resolved: { label: 'Riješeno', classes: 'bg-success/10 text-success' },
  rejected: { label: 'Odbijeno', classes: 'bg-gray-200 text-gray-600' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-200 text-gray-600' };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}
