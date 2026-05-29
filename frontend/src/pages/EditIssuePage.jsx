import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueAPI } from '../services/issueService';
import LocationPicker from '../components/LocationPicker';
import PhotoUpload from '../components/PhotoUpload';

export default function EditIssuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location: null,
    photo_urls: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [accessError, setAccessError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [issueRes, categoriesRes] = await Promise.all([
          issueAPI.fetchIssueById(id),
          issueAPI.fetchCategories(),
        ]);

        const issue = issueRes.data.issue || issueRes.data;
        const cats = categoriesRes.data.categories || categoriesRes.data;
        setCategories(cats);

        // Check ownership and status
        if (issue.user_id !== user?.id) {
          setAccessError('Nemate pravo uredivati ovu prijavu.');
          return;
        }
        if (issue.status !== 'reported') {
          setAccessError('Prijavu je moguce uredivati samo dok je u statusu "Prijavljeno".');
          return;
        }

        setFormData({
          title: issue.title || '',
          description: issue.description || '',
          category_id: issue.category_id ? String(issue.category_id) : '',
          location: issue.latitude && issue.longitude
            ? { lat: issue.latitude, lng: issue.longitude }
            : null,
          photo_urls: Array.isArray(issue.photo_urls) ? issue.photo_urls : [],
        });
      } catch (err) {
        setAccessError('Greska pri ucitavanju prijave.');
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [id, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Naslov je obavezan';
    if (!formData.description.trim()) newErrors.description = 'Opis je obavezan';
    if (!formData.category_id) newErrors.category_id = 'Kategorija je obavezna';
    if (!formData.location) newErrors.location = 'Lokacija je obavezna';
    if (!formData.photo_urls || formData.photo_urls.length === 0) {
      newErrors.photo_urls = 'Najmanje jedna fotografija je obavezna';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      await issueAPI.updateIssue(id, {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        latitude: formData.location.lat,
        longitude: formData.location.lng,
        photo_urls: formData.photo_urls,
      });
      navigate(`/issues/${id}`);
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Doslo je do greske. Pokusajte ponovo.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500">Ucitavanje...</p>
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {accessError}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Natrag
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Uredi prijavu</h1>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Naslov
            </label>
            <input
              id="title"
              type="text"
              maxLength={200}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Kratki opis problema"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Opis
            </label>
            <textarea
              id="description"
              maxLength={2000}
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Detaljniji opis problema"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kategorija
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.category_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Odaberi kategoriju</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokacija
            </label>
            <LocationPicker
              value={formData.location}
              onChange={(coords) => handleChange('location', coords)}
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fotografije (do 5)
            </label>
            <PhotoUpload
              value={formData.photo_urls}
              onChange={(urls) => handleChange('photo_urls', urls)}
              onError={(msg) => setErrors((prev) => ({ ...prev, photo_urls: msg }))}
            />
            {errors.photo_urls && <p className="mt-1 text-sm text-red-600">{errors.photo_urls}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Spremanje...' : 'Spremi promjene'}
          </button>
        </form>
      </div>
    </div>
  );
}
