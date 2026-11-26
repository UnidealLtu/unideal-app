import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../services/listingService.js';

export default function CategoryBar() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const onHome = pathname === '/';
  const current = searchParams.get('category') || '';
  const search = onHome ? searchParams.get('search') || '' : '';

  const linkTo = (category) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const items = [{ label: 'All', value: '' }, ...CATEGORIES.map((c) => ({ label: c, value: c }))];

  return (
    <div className="categories">
      <nav className="container categories-inner" aria-label="Categories">
        {items.map(({ label, value }) => (
          <Link
            key={label}
            to={linkTo(value)}
            className={onHome && current === value ? 'active' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
