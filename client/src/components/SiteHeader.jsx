import { Link, NavLink } from 'react-router-dom';

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner mx-auto flex w-full max-w-[1440px] items-center justify-between px-5">
        <Link className="brand" to="/" aria-label="Lobun Library home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M7 6.5h8.2c2.4 0 4.3 1.9 4.3 4.3v14.7h-8.2A4.3 4.3 0 0 0 7 29.8V6.5Z"
                fill="currentColor"
              />
              <path
                d="M25 6.5h-5.5v19h5.5a4.3 4.3 0 0 1 4.3 4.3V10.8A4.3 4.3 0 0 0 25 6.5Z"
                fill="currentColor"
                opacity=".52"
              />
              <path d="M9.8 11h6.4M9.8 14.5h6.4" stroke="#f8f6ef" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="brand-copy">
            <span className="brand-name">Lobun Library</span>
            <span className="brand-caption">A little more well-read</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Discover
          </NavLink>
          <Link to="/#catalog">The collection</Link>
        </nav>

        <Link className="header-note" to="/#catalog">
          <span className="status-dot" aria-hidden="true" />
          Find your next read
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}

export default SiteHeader;
