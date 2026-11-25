import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard.jsx';
import { getListings, CATEGORIES } from '../services/listingService.js';
import { getFavoriteIds, toggleFavorite } from '../services/profileService.js';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    getListings({ search, category }).then(setListings);
  }, [search, category]);

  useEffect(() => {
    getFavoriteIds().then(setFavorites);
  }, []);

  const handleToggle = async (id) => setFavorites(await toggleFavorite(id));

  return (
    <>
      <h1>Browse listings</h1>
      <div className="filters">
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {listings.length === 0 ? (
        <p className="muted">No listings found.</p>
      ) : (
        <div className="grid">
          {listings.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              isFavorite={favorites.includes(l.id)}
              onToggleFavorite={handleToggle}
            />
          ))}
        </div>
      )}
    </>
  );
}
