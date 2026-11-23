import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api.js';
import BookCover from '../components/BookCover.jsx';
import Feedback from '../components/Feedback.jsx';

function BookDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState({ key: '', book: null, error: '' });
  const [retry, setRetry] = useState(0);
  const requestKey = `${id}\u0000${retry}`;
  const loading = result.key !== requestKey;
  const book = loading ? null : result.book;
  const error = loading ? '' : result.error;

  useEffect(() => {
    const controller = new AbortController();

    api
      .get(`/books/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(({ data }) => setResult({ key: requestKey, book: data, error: '' }))
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setResult({
            key: requestKey,
            book: null,
            error: getErrorMessage(requestError),
          });
        }
      });

    return () => controller.abort();
  }, [id, retry, requestKey]);

  return (
    <section className="detail-section">
      <div className="detail-inner mx-auto w-full max-w-[1180px] px-5">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span> Back to the catalog
        </Link>

        {loading ? (
          <div className="detail-loading" role="status">Opening this book...</div>
        ) : error ? (
          <Feedback
            title="We couldn’t open this book"
            action={() => setRetry((value) => value + 1)}
          >
            {error}
          </Feedback>
        ) : book ? (
          <div className="book-detail">
            <div className="detail-cover-wrap">
              <BookCover book={book} large />
              <span className="detail-cover-caption">FROM THE LOBUN COLLECTION</span>
            </div>
            <div className="detail-copy">
              <p className="eyebrow"><span /> BOOK NO. {book.id.slice(0, 6).toUpperCase()}</p>
              <h1>{book.title}</h1>
              <p className="detail-author">Written by <strong>{book.author}</strong></p>
              <Link
                className="genre-pill"
                to={`/?genreId=${encodeURIComponent(book.genreId)}`}
              >
                {book.genre?.name || 'Uncategorized'} <span aria-hidden="true">↗</span>
              </Link>

              <div className="detail-divider" />
              <p className="detail-intro">
                Some books entertain. Some stay with us long after the last page.
                Take a closer look at this title from our collection.
              </p>

              <dl className="book-facts">
                <div>
                  <dt>ISBN</dt>
                  <dd>{book.isbn}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{book.publishedYear || 'Not listed'}</dd>
                </div>
                <div>
                  <dt>Collection</dt>
                  <dd>{book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'}</dd>
                </div>
              </dl>

              <Link className="button button-dark detail-browse" to="/">
                Keep exploring <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default BookDetailPage;
