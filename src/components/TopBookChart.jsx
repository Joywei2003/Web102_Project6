import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const TopBooksChart = ({ books }) => {
  const getTopBooksData = () => {
    if (!books || books.length === 0) {
      return [];
    }
    return [...books]
      .sort((a, b) => b.edition_count - a.edition_count)
      .slice(0, 10)
      .map(book => ({
        name: book.title.length > 30 ? `${book.title.substring(0, 30)}...` : book.title,
        Editions: book.edition_count
      }))
      .reverse();
  };

  const topBooksData = getTopBooksData();

  return (
    <div className="chart">
      <h3>Top 10 Most Published Books</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topBooksData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Editions" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopBooksChart;
