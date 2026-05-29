import { MarkerF } from '@react-google-maps/api';

const STATUS_COLORS = {
  reported: '#F57C00',     // accent orange
  in_progress: '#1976D2',  // primary blue
  resolved: '#4CAF50',     // success green
  rejected: '#9E9E9E',     // gray
};

function buildIcon(status) {
  const color = STATUS_COLORS[status] || '#F57C00';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
    <circle cx="18" cy="18" r="6" fill="#fff"/>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  };
}

export default function IssueMarker({ issue, onClick }) {
  return (
    <MarkerF
      position={{ lat: parseFloat(issue.latitude), lng: parseFloat(issue.longitude) }}
      icon={buildIcon(issue.status)}
      onClick={() => onClick(issue)}
    />
  );
}
