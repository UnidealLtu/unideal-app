// Profile service (frontend client).
// Mirrors services/favorites-service: profile info + saved (favorite) listings.
// For now data lives in localStorage. Swap these for fetch() calls later.

const PROFILE_KEY = 'unideal.profile';
const FAV_KEY = 'unideal.favorites';

const defaultProfile = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  location: 'Vilnius',
  bio: 'Student selling things I no longer need.',
};

export async function getProfile() {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : defaultProfile;
}

export async function updateProfile(data) {
  const profile = { ...(await getProfile()), ...data };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export async function getFavoriteIds() {
  return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}

export async function toggleFavorite(listingId) {
  const ids = await getFavoriteIds();
  const next = ids.includes(listingId) ? ids.filter((id) => id !== listingId) : [...ids, listingId];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}
