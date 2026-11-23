import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api.js';
import BookGrid from '../components/BookGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get('genreId') || '';
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [genreResult, setGenreResult] = useState({
    retry: -1,
    data: [],
    error: '',
  });
  const [genresRetry, setGenresRetry] = useState(0);
  const genresLoading = genreResult.retry !== genresRetry;
  const genres = genresLoading ? [] : genreResult.data;
  const genresError = genresLoading ? '' : genreResult.error;

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

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSearchInput = useCallback((value) => {
    setSearchInput(value);
    setPage(1);
  }, []);

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

  function clearFilters() {
    setSearchInput('');
    setSearch('');
    chooseGenre('');
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
            <SearchBar
              value={searchInput}
              onChange={handleSearchInput}
              onSearch={handleSearch}
            />

            <div className="genre-filter">
              <div className="filter-heading">
                <h3>Browse by genre</h3>
                <span>{genres.length.toString().padStart(2, '0')}</span>
              </div>
              {genresError ? (
                <div className="genre-error">
                  <p>{genresError}</p>
                  <button
                    type="button"
                    onClick={() => setGenresRetry((value) => value + 1)}
                  >
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

          <BookGrid
            genreId={genreId}
            search={search}
            page={page}
            pageSize={9}
            onPageChange={setPage}
            onClearFilters={clearFilters}
          />
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

export default HomePage;
