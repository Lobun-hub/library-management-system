import { useEffect } from 'react';

function SearchBar({ value, onChange, onSearch }) {
  useEffect(() => {
    const timeout = window.setTimeout(() => onSearch(value.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <>
      <label className="search-label" htmlFor="book-search">
        Search the shelves
      </label>
      <div className="search-field">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle
            cx="10.8"
            cy="10.8"
            r="6.8"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="m16 16 4.2 4.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="book-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Title or author..."
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="clear-search"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <p className="search-hint">Search updates as you type</p>
    </>
  );
}

export default SearchBar;
