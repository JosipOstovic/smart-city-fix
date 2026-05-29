import { useState, useRef } from 'react';
import { uploadImage } from '../services/cloudinaryService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS = 5;

export default function PhotoUpload({ value, onChange, onError }) {
  const photos = Array.isArray(value) ? value : [];
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const remaining = MAX_PHOTOS - photos.length;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    if (files.length > remaining) {
      onError(`Možete dodati još najviše ${remaining} ${remaining === 1 ? 'fotografiju' : 'fotografije'}.`);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        onError('Datoteka mora biti slika');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        onError('Slika ne smije biti veca od 5MB');
        return;
      }
    }

    try {
      setLoading(true);
      const uploaded = [];
      for (const file of files) {
        const url = await uploadImage(file);
        uploaded.push(url);
      }
      onChange([...photos, ...uploaded]);
    } catch (error) {
      onError('Prijenos slike nije uspio. Pokusajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (index) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {photos.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
          >
            <img src={url} alt={`Fotografija ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm leading-none"
              aria-label="Ukloni fotografiju"
            >
              &times;
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="aspect-square border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs mt-1">Dodaj</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        {photos.length}/{MAX_PHOTOS} fotografija &middot; max 5MB po slici
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
