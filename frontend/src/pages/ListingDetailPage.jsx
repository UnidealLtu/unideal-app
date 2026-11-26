import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getListing, deleteListing, formatPrice } from '../services/listingService.js';
import { getProfile, getFavoriteIds, toggleFavorite } from '../services/profileService.js';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getListing(id).then(setListing);
    getProfile().then(setProfile);
    getFavoriteIds().then(setFavorites);
  }, [id]);

  if (listing === undefined) return <p>Loading...</p>;
  if (listing === null) return <p>Listing not found. <Link to="/">Back</Link></p>;

  const isOwner = profile && listing.sellerId === profile.id;
  const isFavorite = favorites.includes(listing.id);

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    await deleteListing(listing.id);
    navigate('/profile');
  };

  return (
    <div className="detail">
      <img src={listing.imageUrl || 'https://placehold.co/600x400?text=No+image'} alt={listing.title} />
      <div>
        <h1>{listing.title}</h1>
        <p className="price big">{formatPrice(listing.price)}</p>
        <p className="muted">{listing.category} · Sold by {listing.sellerName}</p>
        <p>{listing.description}</p>
        <div className="actions">
          <button onClick={async () => setFavorites(await toggleFavorite(listing.id))}>
            {isFavorite ? '♥ Saved' : '♡ Save'}
          </button>
          {isOwner && (
            <>
              <Link className="button" to={`/listings/${listing.id}/edit`}>Edit</Link>
              <button className="danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
