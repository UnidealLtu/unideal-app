
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getListing,
  deleteListing,
  formatPrice
} from '../services/listingService.js';
import {
  getProfile,
  getFavoriteIds,
  toggleFavorite
} from '../services/profileService.js';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setListing(undefined);
    setError('');

    // Get listing information
    getListing(id)
      .then((data) => {
        if (active) setListing(data ?? null);
      })
      .catch(() => {
        if (active) setError('Could not load listing.');
      });

    // Check if user is logged in
    getProfile()
      .then(async (user) => {
        if (!active) return;

        setProfile(user ?? null);

        if (user) {
          try {
            const favoriteIds = await getFavoriteIds();
            if (active) setFavorites(favoriteIds);
          } catch {
            if (active) setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null);
          setFavorites([]);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (error) return <p>{error}</p>;
  if (listing === undefined) return <p>Loading...</p>;

  if (listing === null) {
    return (
      <p>
        Listing not found. <Link to="/">Back</Link>
      </p>
    );
  }

  const isOwner = profile && listing.sellerId === profile.id;
  const isFavorite = favorites.includes(listing.id);

  const handleFavorite = async () => {
    if (!profile) return;

    try {
      const updatedFavorites = await toggleFavorite(listing.id);
      setFavorites(updatedFavorites);
      setError('');
    } catch {
      setError('Could not update favorites.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;

    try {
      await deleteListing(listing.id);
      navigate('/profile');
    } catch {
      setError('Could not delete listing.');
    }
  };

  return (
    <div className="detail">

      {/* Left column: Image and favorite button */}
      <div className="detail-image-section">

        <img
          src={
            listing.imageUrl ||
            'https://placehold.co/600x400?text=No+image'
          }
          alt={listing.title}
        />

        {/* Favorite button for logged-in users */}
        {profile ? (
          <button
            className="favorite-button"
            onClick={handleFavorite}
          >
            {isFavorite ? '♥ Saved' : '♡ Save Favorite'}
          </button>
        ) : (
          <p className="muted">
            Log in to save this listing.
          </p>
        )}

      </div>

      {/* Right column: Listing information */}
      <div className="listing-info">

        {/* Product name */}
        <h1>{listing.title}</h1>

        {/* Price */}
        <p className="price big">
          {formatPrice(listing.price)}
        </p>

        {/* Location */}
        <h3>Location</h3>
        <p className="listing-detail-text">
          {listing.location}
        </p>

        {/* Seller */}
        <h3>Seller</h3>
        <p className="listing-detail-text">
          {listing.sellerName}
        </p>

        {/* Description */}
        <h3>Description</h3>
        <p className="listing-detail-text">
          {listing.description}
        </p>

        {/* Contact seller */}
        <h3>Contact seller</h3>

        {listing.sellerEmail ? (
          <a
            className="listing-detail-text"
            href={`mailto:${listing.sellerEmail}`}
          >
            {listing.sellerEmail}
          </a>
        ) : (
          <p className="listing-detail-text">
            Contact information unavailable.
          </p>
        )}

        {/* Edit and delete for listing owner */}
        {isOwner && (
          <div className="actions">

            <Link
              className="button"
              to={`/listings/${listing.id}/edit`}
            >
              Edit
            </Link>

            <button
              className="danger"
              onClick={handleDelete}
            >
              Delete
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
