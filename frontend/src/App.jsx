import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CategoryBar from './components/CategoryBar.jsx';
import Footer from './components/Footer.jsx';
import ListingsPage from './pages/ListingsPage.jsx';
import ListingDetailPage from './pages/ListingDetailPage.jsx';
import ListingFormPage from './pages/ListingFormPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';

export default function App() {
  return (
    <div className="app">
      <div className="site-header">
        <Navbar />
        {/* Category row only on the shopping pages: the home page and a single listing.
            React Router picks the most specific match, so /listings/new (Sell) is not
            treated as /listings/:id, and /listings/:id/edit falls through to "*". */}
        <Routes>
          <Route path="/" element={<CategoryBar />} />
          <Route path="/listings/new" element={null} />
          <Route path="/listings/:id" element={<CategoryBar />} />
          <Route path="*" element={null} />
        </Routes>
      </div>
      <main className="container">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/listings/new" element={<ListingFormPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/listings/:id/edit" element={<ListingFormPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
