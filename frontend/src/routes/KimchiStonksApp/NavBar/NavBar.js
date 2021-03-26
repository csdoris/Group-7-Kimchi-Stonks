import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';

import logo from '../../../assets/logo.png';

function NavBar() {
  const [search, setSearch] = useState('');

  return (
    <nav className="nav-bar">
      <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
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
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/market">Wall St</NavLink>
        </li>
        <Button
          className="log-out"
          type="button"
          value="Log Out"
          text="Log Out"
          variant="contained"
        />
      </ul>
    </nav>
  );
}

export default NavBar;
