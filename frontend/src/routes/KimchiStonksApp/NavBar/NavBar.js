import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';

import StockSearch from './StockSearch/StockSearch';
import Button from '../../../components/Button/Button';
import { AuthContext } from '../../../contexts/Auth';

import logo from '../../../assets/logo.png';

import './NavBar.scss';

function NavBar() {
  const { logOut } = useContext(AuthContext);

  return (
    <nav className="nav-bar">
      <Link to="/dashboard">
        <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
      </Link>
      <StockSearch />
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
            onClick={logOut}
          />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
