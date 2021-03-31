import React, { useContext } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import Auth from './Auth/Auth';
import KimchiStonksApp from './KimchiStonksApp/KimchiStonksApp';
import { AuthContext } from '../contexts/Auth';

function RootRouter() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {!user
        ? (
          <Switch>
            <Route path="/auth">
              <Auth />
            </Route>
            <Route path="/">
              <Redirect to="/auth" />
            </Route>
          </Switch>
        )
        : (
          <Route path="/">
            <KimchiStonksApp />
          </Route>
        )}
    </Router>
  );
}

export default RootRouter;
