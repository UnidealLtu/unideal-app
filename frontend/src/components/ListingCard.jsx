import { Link } from 'react-router-dom';
import { formatPrice } from '../services/listingService.js';

export default function ListingCard({ listing, isFavorite, onToggleFavorite }) {
  return (
    <div className="card">
      <Link to={`/listings/${listing.id}`}>
        <img src={listing.imageUrl || 'https://placehold.co/400x300?text=No+image'} alt={listing.title} />
      </Link>
      <div className="card-body">
        <div className="card-row">
          <Link to={`/listings/${listing.id}`} className="card-title">{listing.title}</Link>
          {onToggleFavorite && (
            <button
              className="fav"
              title={isFavorite ? 'Remove from saved' : 'Save'}
              onClick={() => onToggleFavorite(listing.id)}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          )}
        </div>
        <div className="card-row muted">
          <span>{listing.category}</span>
          <strong className="price">{formatPrice(listing.price)}</strong>
        </div>
      </div>
    </div>
  );
}
