import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import TextDialog from '../../../components/Dialogs/TextDialog/TextDialog';
import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import { AuthContext } from '../../../contexts/Auth';

import logo from '../../../assets/logo.png';

function LoginForm() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUnsuccessful, setLoginUnsuccessful] = useState(false);

  function isFormValid() {
    return ((email !== '') && (password !== ''));
  }

  function handleLoginForm(event) {
    event.preventDefault();
    setLoginUnsuccessful(!login(email, password));
  }

  return (
    <div>
      <form className="auth-form">
        <div className="form-content">
          <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
          <InputField
            type="text"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputField
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            className="submit"
            type="submit"
            value="Login"
            text="Login"
            variant="contained"
            disabled={!isFormValid()}
            onClick={(event) => handleLoginForm(event)}
          />
        </div>
        <div className="form-footer">
          <p>Don&apos;t have an account?</p>
          <Link className="button text" to="/auth/register">
            Register here
          </Link>
        </div>
      </form>
      {
        loginUnsuccessful
          ? (
            <TextDialog
              title="Hi"
              text="Bye"
              onDismiss={() => setLoginUnsuccessful(false)}
            />
          )
          : null
      }
    </div>
  );
}

export default LoginForm;
