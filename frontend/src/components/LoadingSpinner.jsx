export default function LoadingSpinner({ size = 'md', text }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}
      ></div>
      {text && (
        <p className="mt-3 text-gray-500 text-sm">{text}</p>
      )}
    </div>
  );
}
