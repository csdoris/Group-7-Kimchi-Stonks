import React from 'react';
import {
  Switch, Route, Redirect, useRouteMatch,
} from 'react-router-dom';

import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

import './Auth.scss';

function Auth() {
  const { path } = useRouteMatch();

  return (
    <div className="auth-container">
      <Switch>
        <Route path={`${path}/login`}>
          <LoginForm />
        </Route>
        <Route path={`${path}/register`}>
          <RegisterForm />
        </Route>
        <Route path={path}>
          <Redirect to={`${path}/login`} />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;
