import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
