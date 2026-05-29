import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, description, actionText, actionLink }) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="text-4xl mb-4">{icon}</div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
