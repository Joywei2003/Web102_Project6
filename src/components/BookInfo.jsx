import React from "react";
import { Link } from "react-router-dom";

const BookInfo = ({ bookKey, coverId, title, authorNames, isbn, subjects, publishYear }) => {
  const getCoverUrl = () => {
    if (coverId) { return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`; } 
    else if (isbn) { return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`; }
    return "/images/no-cover.png";
  };

  const keyId = bookKey ? bookKey.replace("/works/", "") : null;

  return (
    <div className="book-info-wrapper">
      {/* Link for the image and title to go to the book detail page */}
      <Link 
        to={`/book/${keyId}`} 
        state={{ authorNames: authorNames, publishYear: publishYear }} 
        className="book-info-link"
      >
        <div className="book-info">
          <div className="book-image">
            <img 
              className="covers"
              src={getCoverUrl()}
              alt={`Cover for ${title || 'Untitled'}`} 
              onError={(e) => { e.target.onerror = null; e.target.src="/images/no-cover.png"; }}
            />
          </div>
          <div className="book-details">
            <div className="book-title">{title || 'Untitled Book'}</div>
            <div className="book-author">
              By: {authorNames ? authorNames.map((author, index) => (
                <React.Fragment key={author}>
                  <Link to={`/author/${encodeURIComponent(author)}`}>{author}</Link>
                  {index < authorNames.length - 1 ? ', ' : ''}
                </React.Fragment>
              )) : 'Unknown Author'}
            </div>
            <div className="book-subjects">
              Subjects: {subjects ? subjects.slice(0, 3).map((subject, index) => (
                <React.Fragment key={subject}>
                  <Link to={`/subject/${encodeURIComponent(subject)}`}>{subject}</Link>
                  {index < subjects.slice(0, 3).length - 1 ? ', ' : ''}
                </React.Fragment>
              )) : ' N/A'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookInfo;
