import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Keep the field in sync with the URL (e.g. when navigating back or clicking a category).
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const category = searchParams.get('category');
    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    const query = params.toString();
    navigate(query ? `/?${query}` : '/');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">Unideal</NavLink>
        <form className="nav-search" role="search" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search for items"
            aria-label="Search for items"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <nav>
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/listings/new">Sell</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/login">Log in</NavLink>
        </nav>
      </div>
    </header>
  );
}
