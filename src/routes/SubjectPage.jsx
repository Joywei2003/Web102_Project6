import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookInfo from '../components/bookInfo'; // Reuse the BookInfo component

const SubjectPage = () => {
  const { subjectName } = useParams(); // Get the subject name from the URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectBooks = async () => {
      setLoading(true);
      try {
        // Search the API for books with the given subject
        const response = await fetch(`https://openlibrary.org/search.json?subject=${encodeURIComponent(subjectName)}&limit=20`);
        const data = await response.json();
        const cleanedBooks = data.docs.filter(book => 
          book.title && 
          book.author_name &&
          (book.cover_i || book.isbn)
        );
        setBooks(cleanedBooks);
      } catch (error) {
        console.error("Failed to fetch subject books:", error);
      }
      setLoading(false);
    };

    fetchSubjectBooks();
  }, [subjectName]); // Re-fetch if the subject name in the URL changes

  return (
    <div className="subject-page-container">
      <h1 className="subject-page-title">Books about {subjectName}</h1>
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
          )) : <p>No books found for this subject.</p>}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
