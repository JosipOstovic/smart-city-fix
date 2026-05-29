import { useEffect, useState } from 'react';

export default function PhotoGallery({ urls, alt = 'Fotografija', size = 'md' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const photos = Array.isArray(urls) ? urls.filter(Boolean) : [];

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, photos.length]);

  if (photos.length === 0) return null;

  const sizeClass = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-32 h-32' : 'w-24 h-24';

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {photos.map((url, index) => (
          <button
            key={url + index}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className={`${sizeClass} rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity flex-shrink-0`}
          >
            <img src={url} alt={`${alt} ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            className="absolute top-4 right-4 text-white text-3xl leading-none w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full"
            aria-label="Zatvori"
          >
            &times;
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
                }}
                className="absolute left-4 text-white text-4xl w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full"
                aria-label="Prethodna"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % photos.length);
                }}
                className="absolute right-4 text-white text-4xl w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full"
                aria-label="Sljedeća"
              >
                &rsaquo;
              </button>
            </>
          )}

          <img
            src={photos[lightboxIndex]}
            alt={`${alt} ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
