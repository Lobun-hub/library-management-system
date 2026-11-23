import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api.js';
import BookCard from '../components/BookCard.jsx';
import Feedback from '../components/Feedback.jsx';

const PAGE_SIZE = 9;

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get('genreId') || '';
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [genreResult, setGenreResult] = useState({
    retry: -1,
    data: [],
    error: '',
  });
  const [bookResult, setBookResult] = useState({
    key: '',
    data: [],
    error: '',
  });
  const [genresRetry, setGenresRetry] = useState(0);
  const [booksRetry, setBooksRetry] = useState(0);
  const requestKey = `${genreId}\u0000${debouncedSearch}\u0000${page}\u0000${booksRetry}`;
  const genres = genreResult.retry === genresRetry ? genreResult.data : [];
  const genresError = genreResult.retry === genresRetry ? genreResult.error : '';
  const booksLoading = bookResult.key !== requestKey;
  const books = booksLoading ? [] : bookResult.data;
  const booksError = booksLoading ? '' : bookResult.error;

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/genres', { signal: controller.signal })
      .then(({ data }) => {
        setGenreResult({ retry: genresRetry, data, error: '' });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setGenreResult({
            retry: genresRetry,
            data: [],
            error: getErrorMessage(error),
          });
        }
      });

    return () => controller.abort();
  }, [genresRetry]);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/books', {
        params: {
          genreId: genreId || undefined,
          search: debouncedSearch || undefined,
          page,
          limit: PAGE_SIZE,
        },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setBookResult({ key: requestKey, data, error: '' });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setBookResult({
            key: requestKey,
            data: [],
            error: getErrorMessage(error),
          });
        }
      });

    return () => controller.abort();
  }, [debouncedSearch, genreId, page, booksRetry, requestKey]);

  function chooseGenre(nextGenreId) {
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (nextGenreId) {
      nextParams.set('genreId', nextGenreId);
    } else {
      nextParams.delete('genreId');
    }
    setSearchParams(nextParams);
  }

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  const selectedGenre = genres.find((genre) => genre.id === genreId);

  return (
    <>
      <section className="catalog-hero">
        <div className="hero-inner mx-auto w-full max-w-[1440px] px-5">
          <div className="hero-copy">
            <p className="eyebrow"><span /> THE OPEN SHELF</p>
            <h1>
              Stories worth
              <br />
              <em>staying up for.</em>
            </h1>
            <p className="hero-description">
              Browse a thoughtfully gathered collection of books. Follow a
              curiosity, find a new favorite, begin anywhere.
            </p>
            <a className="hero-link" href="#catalog">
              Explore the collection <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-disc" />
            <div className="hero-book hero-book-back" />
            <div className="hero-book hero-book-front">
              <span>THE ART OF</span>
              <strong>getting<br />lost</strong>
              <i />
              <small>A GOOD BOOK IS A DOOR</small>
            </div>
            <span className="hero-art-note">VOL. 01&nbsp; / &nbsp;READING ROOM</span>
            <span className="hero-art-spark">✳</span>
          </div>
          <div className="hero-index">01 <span>/</span> 04</div>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow"><span /> THE CATALOG</p>
            <h2>{selectedGenre ? selectedGenre.name : 'Find your next chapter'}</h2>
            <p className="section-description">
              {selectedGenre
                ? `A closer look at books in ${selectedGenre.name}.`
                : 'A good book has a way of finding you.'}
            </p>
          </div>
          <div className="catalog-stamp" aria-hidden="true">
            <span>READ</span>
            <strong>WIDE</strong>
            <span>READ OFTEN</span>
          </div>
        </div>

        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <label className="search-label" htmlFor="book-search">Search the shelves</label>
            <div className="search-field">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                id="book-search"
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Title or author..."
                autoComplete="off"
              />
              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => updateSearch('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <p className="search-hint">Search updates as you type</p>

            <div className="genre-filter">
              <div className="filter-heading">
                <h3>Browse by genre</h3>
                <span>{genres.length.toString().padStart(2, '0')}</span>
              </div>
              {genresError ? (
                <div className="genre-error">
                  <p>{genresError}</p>
                  <button type="button" onClick={() => setGenresRetry((value) => value + 1)}>
                    Retry
                  </button>
                </div>
              ) : (
                <div className="genre-list">
                  <button
                    className={!genreId ? 'genre-option selected' : 'genre-option'}
                    onClick={() => chooseGenre('')}
                    type="button"
                  >
                    <span>All books</span>
                    <span className="genre-count">↗</span>
                  </button>
                  {genres.map((genre) => (
                    <button
                      className={genre.id === genreId ? 'genre-option selected' : 'genre-option'}
                      key={genre.id}
                      onClick={() => chooseGenre(genre.id)}
                      type="button"
                    >
                      <span>{genre.name}</span>
                      <span className="genre-count">
                        {genre._count?.books ?? '—'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="sidebar-note">
              <span className="note-star" aria-hidden="true">✳</span>
              <p>“A room without books is like a body without a soul.”</p>
              <span className="note-credit">— CICERO</span>
            </div>
          </aside>

          <div className="catalog-results">
            <div className="results-toolbar">
              <p>
                {booksLoading
                  ? 'Finding your books...'
                  : booksError
                    ? 'Catalog unavailable'
                    : `${books.length} ${books.length === 1 ? 'book' : 'books'} on this page`}
              </p>
              <span className="page-indicator">
                PAGE {String(page).padStart(2, '0')}
              </span>
            </div>

            {booksError ? (
              <Feedback
                title="The shelves are out of reach"
                action={() => setBooksRetry((value) => value + 1)}
              >
                {booksError}
              </Feedback>
            ) : booksLoading ? (
              <div className="book-grid" aria-label="Loading books">
                {Array.from({ length: 6 }, (_, index) => (
                  <div className="book-skeleton" key={index}>
                    <div className="skeleton-cover" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                ))}
              </div>
            ) : books.length ? (
              <>
                <div className="book-grid">
                  {books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
                <div className="pagination">
                  <button
                    className="button button-outline"
                    disabled={page === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    type="button"
                  >
                    <span aria-hidden="true">←</span> Previous
                  </button>
                  <span>{page}</span>
                  <button
                    className="button button-outline"
                    disabled={books.length < PAGE_SIZE}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                  >
                    Next <span aria-hidden="true">→</span>
                  </button>
                </div>
              </>
            ) : (
              <Feedback
                title="No books found"
                action={() => {
                  updateSearch('');
                  chooseGenre('');
                }}
                actionLabel="Clear filters"
              >
                Try another title or author, or browse all genres.
              </Feedback>
            )}
          </div>
        </div>
      </section>

      <section className="catalog-cta">
        <div>
          <p className="eyebrow"><span /> GOOD BOOKS, GOOD COMPANY</p>
          <h2>There’s always room<br />for one more story.</h2>
        </div>
        <Link className="button button-light" to="#catalog">
          Back to the shelves <span aria-hidden="true">↑</span>
        </Link>
      </section>
    </>
  );
}

export default CatalogPage;
