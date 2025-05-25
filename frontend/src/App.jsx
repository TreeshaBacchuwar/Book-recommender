import React, { useEffect, useState } from 'react';
import './App.css';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Fallback Open Library cover URL
const getOpenLibraryCoverURL = (title) => {
  const formattedTitle = title.replace(/\s+/g, '+');
  return `https://covers.openlibrary.org/b/title/${formattedTitle}-M.jpg?default=false`;
};

// BookCover component tries Google cover first, fallback to Open Library, then placeholder
function BookCover({ title, googleCover }) {
  const [imgSrc, setImgSrc] = React.useState(googleCover || getOpenLibraryCoverURL(title));

  return (
    <img
      src={imgSrc}
      alt={title}
      className="book-cover"
      onError={() => {
        if (imgSrc !== getOpenLibraryCoverURL(title)) {
          setImgSrc(getOpenLibraryCoverURL(title));
        } else {
          setImgSrc('https://via.placeholder.com/50x70?text=📖');
        }
      }}
    />
  );
}

export default function BookRecommender() {
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Favorites now store full book objects, not just titles
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Toggle favorite by book object
  const toggleFavorite = (book) => {
    const exists = favorites.find((fav) => fav.title === book.title);
    let updated;
    if (exists) {
      updated = favorites.filter((fav) => fav.title !== book.title);
    } else {
      updated = [...favorites, book];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (title) => favorites.some((fav) => fav.title === title);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [search, books]);

  const fetchBooks = async () => {
    if (!genre) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/books?genre=${genre}`);
      const data = await res.json();
      setBooks(data.books);
      setFilteredBooks(data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setFilteredBooks([]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀ Light' : '🌙 Dark'}
      </button>

      <h1 className="heading">📚 Book Recommender</h1>

      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="select"
      >
        <option value="">Select a genre</option>
        <option value="Fiction">Fiction</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Horror">Horror</option>
        <option value="Romance">Romance</option>
      </select>

      <input
        type="text"
        placeholder="Search book title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <button onClick={fetchBooks} disabled={!genre} className="button">
        {loading ? 'Loading...' : 'Recommend'}
      </button>

      {loading && (
        <img
          className="spinner"
          src="/loading.png"
          alt="loading"
        />
      )}

      {filteredBooks.length > 0 && (
        <div className="book-list">
          {filteredBooks.map(({ title, google_cover }) => (
            <div className="book-card" key={title}>
              <BookCover title={title} googleCover={google_cover} />
              <span style={{ flex: 1 }}>{title}</span>
              <button
                onClick={() => toggleFavorite({ title, google_cover })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: isFavorite(title) ? 'red' : '#888',
                }}
                title={isFavorite(title) ? 'Unfavorite' : 'Add to favorites'}
              >
                {isFavorite(title) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <>
          <h2 className="favorites-heading">❤️ Your Favorites</h2>
          <div className="book-list favorites-list">
            {favorites.map(({ title, google_cover }) => (
              <div className="book-card" key={title}>
                <BookCover title={title} googleCover={google_cover} />
                <span style={{ flex: 1 }}>{title}</span>
                <button
                  onClick={() => toggleFavorite({ title, google_cover })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: 'red',
                  }}
                  title="Remove from favorites"
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
