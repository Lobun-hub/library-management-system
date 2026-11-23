const genreThemes = {
  fantasy: 'fantasy',
  'science fiction': 'science',
  mystery: 'mystery',
  history: 'history',
};

function BookCover({ book, large = false }) {
  const theme = genreThemes[book.genre?.name?.toLowerCase()] || 'default';
  const initials = book.title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

  return (
    <div
      className={`book-cover cover-${theme}${large ? ' book-cover-large' : ''}`}
      role="img"
      aria-label={`Decorative cover for ${book.title} by ${book.author}`}
    >
      <span className="cover-rule" aria-hidden="true" />
      <span className="cover-kicker">LOBUN LIBRARY · {book.genre?.name || 'COLLECTION'}</span>
      <span className="cover-initials" aria-hidden="true">
        {initials}
      </span>
      <span className="cover-title">{book.title}</span>
      <span className="cover-author">{book.author}</span>
      <span className="cover-seal" aria-hidden="true">
        L
      </span>
    </div>
  );
}

export default BookCover;
