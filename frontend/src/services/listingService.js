// Listing service (frontend client).
// Mirrors services/listings-service: create, read, update, delete listings.
// For now data lives in localStorage. To connect the real FastAPI backend,
// replace the bodies of these functions with fetch() calls.

const KEY = 'unideal.listings';

const seed = [
  {
    id: '1',
    title: 'Calculus textbook (8th edition)',
    description: 'Lightly used, a few highlighted pages.',
    price: 25,
    category: 'Books',
    imageUrl: 'https://picsum.photos/seed/book/400/300',
    sellerId: 'demo-user',
    sellerName: 'Demo User',
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Desk lamp',
    description: 'LED lamp, adjustable arm, works perfectly.',
    price: 12,
    category: 'Home',
    imageUrl: 'https://picsum.photos/seed/lamp/400/300',
    sellerId: 'someone-else',
    sellerName: 'Jamie',
    createdAt: '2026-11-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'City bike',
    description: '3 gears, new tyres. Pick up only.',
    price: 90,
    category: 'Sports',
    imageUrl: 'https://picsum.photos/seed/bike/400/300',
    sellerId: 'someone-else',
    sellerName: 'Jamie',
    createdAt: '2026-11-15T09:15:00Z',
  },
];

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return [...seed];
  }
  return JSON.parse(raw);
}

function save(listings) {
  localStorage.setItem(KEY, JSON.stringify(listings));
}

export const CATEGORIES = ['Books', 'Electronics', 'Home', 'Clothing', 'Sports', 'Other'];

export async function getListings({ search = '', category = '' } = {}) {
  const q = search.trim().toLowerCase();
  return load()
    .filter((l) => !category || l.category === category)
    .filter((l) => !q || l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getListing(id) {
  return load().find((l) => l.id === id) || null;
}

export async function getListingsBySeller(sellerId) {
  return load().filter((l) => l.sellerId === sellerId);
}

export async function createListing(data) {
  const listings = load();
  const listing = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  listings.push(listing);
  save(listings);
  return listing;
}

export async function updateListing(id, data) {
  const listings = load().map((l) => (l.id === id ? { ...l, ...data } : l));
  save(listings);
  return listings.find((l) => l.id === id);
}

export async function deleteListing(id) {
  save(load().filter((l) => l.id !== id));
}
