import { Link } from 'react-router-dom';
import BookCover from './BookCover.jsx';

function BookCard({ book }) {
  return (
    <article className="book-card">
      <Link
        className="book-card-link"
        to={`/books/${encodeURIComponent(book.id)}`}
        aria-label={`View ${book.title} by ${book.author}`}
      >
        <BookCover book={book} />
        <div className="book-card-body">
          <div className="book-card-meta">
            <span className="genre-label">{book.genre?.name || 'Uncategorized'}</span>
            {book.publishedYear && <span>{book.publishedYear}</span>}
          </div>
          <h3>{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <span className="card-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </Link>
    </article>
  );
}

export default BookCard;
