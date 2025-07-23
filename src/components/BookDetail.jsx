import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const BookDetail = () => {
  const { bookKey } = useParams();
  const location = useLocation();
  const { authorNames, publishYear } = location.state || {};

  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://openlibrary.org/works/${bookKey}.json`);
        const data = await response.json();
        setBookDetails(data);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
      setLoading(false);
    };

    fetchBookDetails();
  }, [bookKey]);

  if (loading) {
    return <p className="loading-message">Loading book details...</p>;
  }

  if (!bookDetails) {
    return <p className="loading-message">Book details not found.</p>;
  }

  const description = typeof bookDetails.description === 'string' 
    ? bookDetails.description 
    : bookDetails.description?.value || "No description available.";

  return (
    <div className="book-detail-container">
      <h1 className="book-detail-title">{bookDetails.title}</h1>
      
      <div className="book-meta">
        <p>By: {authorNames ? authorNames.map((author, index) => (
          <React.Fragment key={author}>
            <Link to={`/author/${encodeURIComponent(author)}`}>{author}</Link>
            {index < authorNames.length - 1 ? ', ' : ''}
          </React.Fragment>
        )) : 'Unknown Author'}</p>
        <p>First Published: {publishYear || 'N/A'}</p>
      </div>

      <img 
        src={bookDetails.covers ? `https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg` : '/images/no-cover.png'} 
        alt={`Cover for ${bookDetails.title}`}
        className="book-detail-cover"
      />
      <div className="book-detail-content">
        <h2>Description</h2>
        <p className="description-text">{description}</p>
        
        <h2>Subjects</h2>
        <ul className="subjects-list">
          {bookDetails.subjects ? bookDetails.subjects.slice(0, 10).map(subject => (
            <li key={subject}>
              <Link to={`/subject/${encodeURIComponent(subject)}`}>{subject}</Link>
            </li>
          )) : <li>No subjects listed.</li>}
        </ul>
      </div>
    </div>
  );
};

export default BookDetail;
