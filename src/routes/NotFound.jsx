import React from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main style={{ padding: "1rem", textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>There's nothing here!</p>
      <Link to="/">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFound;
