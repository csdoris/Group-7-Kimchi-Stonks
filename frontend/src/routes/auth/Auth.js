import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

function Auth() {
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${path}/login`}>
          <LoginForm />
        </Route>
        <Route path={`${path}/register`}>
          <RegisterForm />
        </Route>
        <Route path={path}}>
          <Redirect to={`${path}/login`} />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;
