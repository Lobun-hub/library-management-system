import { Route, Routes } from 'react-router-dom';
import BookDetailPage from './pages/BookDetailPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import './App.css';

function App() {
  return (
    <div className="app-shell min-h-screen bg-[#f7f5ef] text-[#18342c]">
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span className="footer-mark" aria-hidden="true">
          LL
        </span>
        <span>Made for curious minds.</span>
        <span className="footer-note">Your next chapter is waiting.</span>
      </footer>
    </div>
  );
}

export default App;
