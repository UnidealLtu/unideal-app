import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">Unideal</NavLink>
        <nav>
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/listings/new">Sell</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}
