import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard.jsx';
import { getListing, getListingsBySeller } from '../services/listingService.js';
import { getProfile, updateProfile, getFavoriteIds, toggleFavorite } from '../services/profileService.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [saved, setSaved] = useState([]);

  const loadSaved = async (ids) => {
    const listings = await Promise.all(ids.map(getListing));
    setSaved(listings.filter(Boolean));
  };

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      getListingsBySeller(p.id).then(setMyListings);
    });
    getFavoriteIds().then(loadSaved);
  }, []);

  if (!profile) return <p>Loading...</p>;

  const set = (field) => (e) => setProfile({ ...profile, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setProfile(await updateProfile(profile));
  };

  const handleUnsave = async (id) => loadSaved(await toggleFavorite(id));

  return (
    <div className="profile-columns">
      <section>
        <h2>My listings ({myListings.length})</h2>
        {myListings.length === 0 ? (
          <p className="muted">You have not listed anything yet.</p>
        ) : (
          <div className="grid">{myListings.map((l) => <ListingCard key={l.id} listing={l} />)}</div>
        )}
      </section>

      <section>
        <h2>Saved listings ({saved.length})</h2>
        {saved.length === 0 ? (
          <p className="muted">No saved listings.</p>
        ) : (
          <div className="grid">
            {saved.map((l) => (
              <ListingCard key={l.id} listing={l} isFavorite onToggleFavorite={handleUnsave} />
            ))}
          </div>
        )}
      </section>

      <section className="profile">
        <form className="form" onSubmit={handleSave}>
          <label>Name<input required value={profile.name} onChange={set('name')} /></label>
          <label>Email<input type="email" value={profile.email} onChange={set('email')} /></label>
          <label>Location<input value={profile.location} onChange={set('location')} /></label>
          <button type="submit">Save profile</button>
        </form>
      </section>
    </div>
  );
}
