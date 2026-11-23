import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../api.js';
import BookCard from './BookCard.jsx';
import Feedback from './Feedback.jsx';

function BookGrid({
  genreId,
  search,
  page,
  pageSize,
  onPageChange,
  onClearFilters,
}) {
  const [result, setResult] = useState({ key: '', books: [], error: '' });
  const [retry, setRetry] = useState(0);
  const requestKey = `${genreId}\u0000${search}\u0000${page}\u0000${pageSize}\u0000${retry}`;
  const loading = result.key !== requestKey;
  const books = loading ? [] : result.books;
  const error = loading ? '' : result.error;

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/books', {
        params: {
          genreId: genreId || undefined,
          search: search || undefined,
          page,
          limit: pageSize,
        },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setResult({ key: requestKey, books: data, error: '' });
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setResult({
            key: requestKey,
            books: [],
            error: getErrorMessage(requestError),
          });
        }
      });

    return () => controller.abort();
  }, [genreId, search, page, pageSize, retry, requestKey]);

  return (
    <div className="catalog-results">
      <div className="results-toolbar">
        <p>
          {loading
            ? 'Finding your books...'
            : error
              ? 'Catalog unavailable'
              : `${books.length} ${books.length === 1 ? 'book' : 'books'} on this page`}
        </p>
        <span className="page-indicator">
          PAGE {String(page).padStart(2, '0')}
        </span>
      </div>

      {error ? (
        <Feedback
          title="The shelves are out of reach"
          action={() => setRetry((value) => value + 1)}
        >
          {error}
        </Feedback>
      ) : loading ? (
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
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="pagination">
            <button
              className="button button-outline"
              disabled={page === 1}
              onClick={() => onPageChange((current) => Math.max(1, current - 1))}
              type="button"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <span>{page}</span>
            <button
              className="button button-outline"
              disabled={books.length < pageSize}
              onClick={() => onPageChange((current) => current + 1)}
              type="button"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      ) : (
        <Feedback
          title="No books found"
          action={onClearFilters}
          actionLabel="Clear filters"
        >
          Try another title or author, or browse all genres.
        </Feedback>
      )}
    </div>
  );
}

export default BookGrid;
