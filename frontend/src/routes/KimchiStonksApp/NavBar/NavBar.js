import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';

import logo from '../../../assets/logo.png';

import './NavBar.css';

function NavBar() {
  const [search, setSearch] = useState('');

  return (
    <nav className="nav-bar">
      <Link to="/dashboard">
        <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
      </Link>
      <InputField
        className="search"
        type="text"
        name="search"
        value={search}
        placeholder="Search Stonks"
        onChange={(event) => setSearch(event.target.value)}
      />
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/market">Wall St</NavLink>
        </li>
        <li className="nav-item">
          <Button
            className="log-out"
            type="button"
            value="Log Out"
            text="Log Out"
            variant="contained"
          />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
