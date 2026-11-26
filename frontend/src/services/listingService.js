
const API_URL = '/api/listings';

const priceFormat = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});

export function formatPrice(price) {
  return priceFormat.format(Number(price));
}

export const CATEGORIES = [
  'Books',
  'Electronics',
  'Home',
  'Clothing',
  'Sports',
  'Other',
];

// Prepare listing data for FastAPI
function prepareListing(data) {
  return {
    title: data.title,
    description: data.description ?? '',
    price: Number(data.price),
    location: data.location,
    category: data.category || 'Other',
    imageUrl: data.imageUrl || null,

    // Seller information from profile
    sellerId: data.sellerId ?? null,
    sellerName: data.sellerName ?? null,
    sellerEmail: data.sellerEmail ?? null,
  };
}

// GET: Retrieve all listings
export async function getListings({ search = '', category = '' } = {}) {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }

  const listings = await response.json();
  const q = search.trim().toLowerCase();

  return listings
    .filter((listing) =>
      !category || listing.category === category
    )
    .filter((listing) =>
      !q ||
      listing.title.toLowerCase().includes(q) ||
      (listing.description || '').toLowerCase().includes(q)
    )
    .sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
}

// GET: Retrieve one listing
export async function getListing(id) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch listing');
  }

  return response.json();
}

// GET: Retrieve listings belonging to a seller
export async function getListingsBySeller(sellerId) {
  const listings = await getListings();

  return listings.filter(
    (listing) => listing.sellerId === sellerId
  );
}

// POST: Create a listing
export async function createListing(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prepareListing(data)),
  });

  if (!response.ok) {
    throw new Error('Failed to create listing');
  }

  return response.json();
}

// PUT: Update a listing
export async function updateListing(id, data) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepareListing(data)),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update listing');
  }

  return response.json();
}

// DELETE: Delete a listing
export async function deleteListing(id) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete listing');
  }
}


export async function uploadListingImage(file) {
  const formData = new FormData();

  formData.append('file', file);

  const response = await fetch('/api/images', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || 'Could not upload image');
  }

  const result = await response.json();

  return result.imageUrl;
}
