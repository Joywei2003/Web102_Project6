import { useState, useEffect } from 'react';
import './App.css';
import BookInfo from "./components/bookInfo"; 
import TopBooksChart from './components/TopBookChart'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

function App() {
  const [defaultList, setDefaultList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("All");
  const [loading, setLoading] = useState(true);

  const fields = "key,title,author_name,cover_i,isbn,subject,first_publish_year,edition_count";

  useEffect(() => {
    async function fetchInitialBooks() {
      setLoading(true);
      const response = await fetch(`https://openlibrary.org/search.json?q=classic+works&limit=100&fields=${fields}`);
      const json = await response.json();
      const booksData = json.docs || [];
      const cleanedBooks = booksData.filter(book => 
        book.title && 
        book.author_name && book.author_name.length > 0 &&
        book.edition_count > 20 &&
        (book.cover_i || (book.isbn && book.isbn.length > 0))
      );
      setDefaultList(cleanedBooks);
      setLoading(false);
    }
    fetchInitialBooks();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      async function fetchSearchResults() {
        setLoading(true);
        let queryParam = `q=${encodeURIComponent(debouncedSearchTerm)}`;
        if (searchType !== "All") {
          queryParam = `${searchType.toLowerCase()}=${encodeURIComponent(debouncedSearchTerm)}`;
        }
        
        const response = await fetch(`https://openlibrary.org/search.json?${queryParam}&limit=20&fields=${fields}`);
        const json = await response.json();
        const booksData = json.docs || [];
        const cleanedBooks = booksData.filter(book => 
          book.title && 
          book.author_name && book.author_name.length > 0 &&
          (book.cover_i || (book.isbn && book.isbn.length > 0))
        );
        setSearchResults(cleanedBooks);
        setLoading(false);
      }
      fetchSearchResults();
    }
  }, [debouncedSearchTerm, searchType]);

  const booksToDisplay = searchInput ? searchResults : defaultList;

  // Data processing for the author chart
  const getTopAuthorsData = () => {
    const authors = {};
    booksToDisplay.forEach(book => {
      book.author_name.forEach(author => {
        authors[author] = (authors[author] || 0) + 1;
      });
    });
    return Object.keys(authors).map(author => ({
      name: author,
      Books: authors[author]
    }))
    .sort((a, b) => b.Books - a.Books)
    .slice(0, 10)
    .reverse();
  };

  const topAuthorsData = getTopAuthorsData();

  return (
    <div className='whole-page'>
      <div className='header'>
        <div className='page-title'>The Library</div>
        <div className='description'>Search for books by title, author, and more.</div>
      </div>
      <div className='search'>
        <div className='inputText'>
          <input
            className='textBox'
            type="text"
            placeholder="Search for..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className='inputRadio'>
          {["All", "Title", "Author", "ISBN", "Subject"].map(type => (
            <label key={type}><input type="radio" name="searchType" value={type} checked={searchType === type} onChange={(e) => setSearchType(e.target.value)} />{type}</label>
          ))}
        </div>
      </div>
      
      <div className="charts-container">
        {/* Use the new reusable component */}
        <TopBooksChart books={booksToDisplay} />
        <div className="chart">
          <h3>Top 10 Authors by # of Books</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topAuthorsData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Books" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='result'>
        {loading ? (
          <p>Loading books...</p>
        ) : booksToDisplay.length > 0 ? (
          <div className='book-list'> 
            {booksToDisplay.map((book) => (
              <BookInfo
                key={book.key} 
                bookKey={book.key}
                coverId={book.cover_i} 
                isbn={book.isbn ? book.isbn[0] : null} 
                title={book.title}
                authorNames={book.author_name} 
                subjects={book.subject} 
                publishYear={book.first_publish_year}
              />
            ))}
          </div>
        ) : (
          <p>No results found for "{searchInput}".</p>
        )}
      </div>
    </div>
  );
}

export default App;
