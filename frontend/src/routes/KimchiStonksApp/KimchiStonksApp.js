import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import NavBar from './NavBar/NavBar';
import UserInfoBar from './UserInfoBar/UserInfoBar';
import Stock from './Stock/Stock';
import Dashboard from './Dashboard/Dashboard';
import Market from './Market/Market';

import './KimchiStonksApp.css';

function KimchiStonksApp() {
  return (
    <div className="app-container">
      <div className="row">
        <NavBar />
        <UserInfoBar />
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/market">
            <Market />
          </Route>
          <Route path="/stock">
            <Stock />
          </Route>
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default KimchiStonksApp;
