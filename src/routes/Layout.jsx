import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
        <nav>
          <ul className="nav-ul">
            <li className="home-link" key="home-button">
            <Link style={{ color: "black" }} to="/">
              Home
            </Link>
            </li>
          </ul>
        </nav>
        <Outlet />
    </div>
  )
}

export default Layout;
