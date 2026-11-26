
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CATEGORIES,
  createListing,
  getListing,
  updateListing,
  uploadListingImage
} from '../services/listingService.js';
import { getProfile } from '../services/profileService.js';

const empty = {
  title: '',
  description: '',
  price: '',
  category: CATEGORIES[0],
  imageUrl: ''
};

export default function ListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load listing information when editing
  useEffect(() => {
    let active = true;

    setError('');
    setImageFile(null);

    if (id) {
      setLoading(true);

      getListing(id)
        .then((listing) => {
          if (!active) return;

          if (!listing) {
            setError('Listing not found.');
            return;
          }

          setForm({
            title: listing.title ?? '',
            description: listing.description ?? '',
            price: String(listing.price),
            category: listing.category ?? CATEGORIES[0],
            imageUrl: listing.imageUrl ?? ''
          });
        })
        .catch(() => {
          if (active) {
            setError('Could not load listing.');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setForm({ ...empty });
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  // Create an image preview when a file is selected
  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  // Update form fields
  const set = (field) => (e) => {
    setForm((previous) => ({
      ...previous,
      [field]: e.target.value
    }));
  };

  // Handle image selection
  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG and WebP images are supported.');
      setImageFile(null);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      setImageFile(null);
      e.target.value = '';
      return;
    }

    setError('');
    setImageFile(file);
  };

  // Create or update listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSaving(true);

    try {
      // Get seller information from profile
      const profile = await getProfile();

      if (
        !profile ||
        !profile.id ||
        !profile.name ||
        !profile.email ||
        !profile.location
      ) {
        throw new Error(
          'Complete your profile before publishing a listing.'
        );
      }

      // Upload image if the user selected a new one
      let imageUrl = form.imageUrl || null;

      if (imageFile) {
        imageUrl = await uploadListingImage(imageFile);
      }

      // Combine product information with seller profile
      const data = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        imageUrl: imageUrl,

        // Seller information from profile
        location: profile.location,
        sellerId: profile.id,
        sellerName: profile.name,
        sellerEmail: profile.email
      };

      if (id) {
        // Update existing listing
        await updateListing(id, data);
        navigate(`/listings/${id}`);
      } else {
        // Create new listing
        const created = await createListing(data);
        navigate(`/listings/${created.id}`);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message || 'Could not save listing.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading listing...</p>;
  }

  return (
    <form
      className="form form-centered"
      onSubmit={handleSubmit}
    >
      <h1>
        {id ? 'Edit listing' : 'Sell a product'}
      </h1>

      {/* Title */}
      <label>
        Title
        <input
          required
          maxLength={150}
          value={form.title}
          onChange={set('title')}
        />
      </label>

      {/* Description */}
      <label>
        Description
        <textarea
          rows="4"
          maxLength={1000}
          value={form.description}
          onChange={set('description')}
        />
      </label>

      {/* Price */}
      <label>
        Price (kr)
        <input
          required
          type="number"
          min="1"
          step="1"
          value={form.price}
          onChange={set('price')}
        />
      </label>

      {/* Category */}
      <label>
        Category
        <select
          value={form.category}
          onChange={set('category')}
        >
          {CATEGORIES.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </label>

      {/* Image upload */}
      <label>
        Product image
        <input
          key={id || 'new'}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
        />
      </label>

      <p className="muted">
        JPG, PNG or WebP. Maximum 5 MB.
      </p>

      {/* Image preview */}
      {(imagePreview || form.imageUrl) && (
        <img
          className="preview"
          src={imagePreview || form.imageUrl}
          alt="Listing preview"
        />
      )}

      {/* Error message */}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={saving || loading}
      >
        {saving
          ? 'Saving...'
          : id
            ? 'Save changes'
            : 'Publish listing'}
      </button>
    </form>
  );
}
