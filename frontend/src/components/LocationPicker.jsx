import { useState, useCallback } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = { lat: 45.815, lng: 15.982 };

export default function LocationPicker({ value, onChange }) {
  const [center, setCenter] = useState(value || defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleMapClick = useCallback(
    (e) => {
      const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      onChange(coords);
    },
    [onChange]
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(coords);
        onChange(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  };

  if (!isLoaded) {
    return <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">Učitavanje karte...</div>;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleUseMyLocation}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Koristi moju lokaciju
      </button>

      <div className="rounded-lg border border-gray-300 overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={handleMapClick}
        >
          {value && <MarkerF position={value} />}
        </GoogleMap>
      </div>

      {value && (
        <p className="text-sm text-gray-600">
          Odabrana lokacija: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
