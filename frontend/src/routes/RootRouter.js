import React from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

import Auth from './Auth/Auth';
import KimchiStonksApp from './KimchiStonksApp/KimchiStonksApp';

function RootRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/">
          <KimchiStonksApp />
        </Route>
      </Switch>
    </Router>
  );
}

export default RootRouter;
