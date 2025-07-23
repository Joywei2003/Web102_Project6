import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookInfo from '../components/bookInfo';
import TopBooksChart from '../components/TopBookChart'; 

const AuthorPage = () => {
  const { authorName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorBooks = async () => {
      setLoading(true);
      try {
        // Request all necessary fields, including edition_count for the chart
        const response = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(authorName)}&limit=100&fields=key,title,author_name,cover_i,isbn,subject,first_publish_year,edition_count`);
        const data = await response.json();
        const cleanedBooks = data.docs.filter(book => 
          book.title && 
          book.author_name &&
          book.edition_count && // Ensure we have edition_count for the chart
          (book.cover_i || book.isbn)
        );
        setBooks(cleanedBooks);
      } catch (error) {
        console.error("Failed to fetch author's books:", error);
      }
      setLoading(false);
    };

    fetchAuthorBooks();
  }, [authorName]);

  return (
    <div className="author-page-container">
      <h1 className="author-page-title">Books by {authorName}</h1>
      
      {/* Add the chart component to the author page */}
      <div className="charts-container">
        <TopBooksChart books={books} />
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="book-list">
          {books.length > 0 ? books.map(book => (
            <BookInfo
              key={book.key}
              bookKey={book.key}
              coverId={book.cover_i}
              title={book.title}
              authorNames={book.author_name}
              isbn={book.isbn ? book.isbn[0] : null}
              subjects={book.subject}
              publishYear={book.first_publish_year}
            />
          )) : <p>No books found for this author.</p>}
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
