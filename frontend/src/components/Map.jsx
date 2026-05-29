import { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 45.815, lng: 15.982 };
const defaultZoom = 13;

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true,
};

export default function Map({ children, center, zoom, onClick, onBoundsChanged }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });
  const [mapInstance, setMapInstance] = useState(null);

  const handleLoad = useCallback((map) => setMapInstance(map), []);
  const handleUnmount = useCallback(() => setMapInstance(null), []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-gray-500 text-lg">Učitavanje karte...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center || defaultCenter}
      zoom={zoom || defaultZoom}
      options={mapOptions}
      onClick={onClick}
      onBoundsChanged={onBoundsChanged}
      onLoad={handleLoad}
      onUnmount={handleUnmount}
    >
      {mapInstance && children}
    </GoogleMap>
  );
}
