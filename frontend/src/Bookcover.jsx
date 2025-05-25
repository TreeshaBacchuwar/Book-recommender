import React, { useState } from 'react';

const getOpenLibraryCoverURL = (title) => {
  const formattedTitle = title.replace(/\s+/g, '+');
  return `https://covers.openlibrary.org/b/title/${formattedTitle}-M.jpg?default=false`;
};

const getGoogleBooksCoverURL = (title) => {
  // Use Google Books API thumbnail by searching with title
  // This URL format tries to get an image for a known Google Book ID, but since we only have title,
  // we will fallback to a generic URL format using title as a search parameter.
  // So for dynamic fetch, we will implement inside the component.
  return null; // placeholder; real fetch below
};

export default function BookCover({ title, alt, className }) {
  const [imgSrc, setImgSrc] = useState(getOpenLibraryCoverURL(title));
  const [triedGoogle, setTriedGoogle] = useState(false);

  const fetchGoogleCover = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}`
      );
      const data = await response.json();
      if (
        data.totalItems > 0 &&
        data.items[0].volumeInfo.imageLinks &&
        data.items[0].volumeInfo.imageLinks.thumbnail
      ) {
        setImgSrc(data.items[0].volumeInfo.imageLinks.thumbnail);
      } else {
        setImgSrc('https://via.placeholder.com/50x70?text=No+Cover');
      }
    } catch {
      setImgSrc('https://via.placeholder.com/50x70?text=No+Cover');
    }
  };

  const handleError = () => {
    if (!triedGoogle) {
      setTriedGoogle(true);
      fetchGoogleCover();
    } else {
      setImgSrc('https://via.placeholder.com/50x70?text=No+Cover');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || title}
      className={className}
      onError={handleError}
      style={{ objectFit: 'cover' }}
    />
  );
}
