import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard.jsx';
import { getListings } from '../services/listingService.js';
import { getFavoriteIds, toggleFavorite } from '../services/profileService.js';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  // Search and category come from the URL, set by the header search and category bar.
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

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
