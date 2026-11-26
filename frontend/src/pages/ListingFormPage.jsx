import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, createListing, getListing, updateListing } from '../services/listingService.js';
import { getProfile } from '../services/profileService.js';

const empty = { title: '', description: '', price: '', category: CATEGORIES[0], imageUrl: '' };

export default function ListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (id) getListing(id).then((l) => l && setForm(l));
    else setForm(empty);
  }, [id]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Read an uploaded image as a data URL so it can be stored locally.
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price) };
    if (id) {
      await updateListing(id, data);
      navigate(`/listings/${id}`);
    } else {
      const profile = await getProfile();
      const created = await createListing({ ...data, sellerId: profile.id, sellerName: profile.name });
      navigate(`/listings/${created.id}`);
    }
  };

  return (
    <form className="form form-centered" onSubmit={handleSubmit}>
      <h1>{id ? 'Edit listing' : 'Sell a product'}</h1>
      <label>Title<input required value={form.title} onChange={set('title')} /></label>
      <label>Description<textarea rows="4" value={form.description} onChange={set('description')} /></label>
      <label>Price (kr)<input required type="number" min="0" step="1" value={form.price} onChange={set('price')} /></label>
      <label>Category
        <select value={form.category} onChange={set('category')}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Image URL
        <input
          value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
          onChange={set('imageUrl')}
          placeholder="https://..."
        />
      </label>
      <label>...or upload an image<input type="file" accept="image/*" onChange={handleFile} /></label>
      {form.imageUrl && <img className="preview" src={form.imageUrl} alt="Preview" />}
      <button type="submit">{id ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
