import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import { AuthContext } from '../../../contexts/Auth';

import logo from '../../../assets/logo.png';

const url = process.env.REACT_APP_API_URL;

function LoginForm() {
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function isFormValid() {
    return ((email !== '') && (password !== ''));
  }

  function handleLoginForm(event) {
    event.preventDefault();
    axios.post(`${url}/auth/login`, {
      email,
      password,
    }).then((res) => {
      const { status, data } = res;
      const { user } = data;

      console.log(res);

      if (status === 200) {
        setUser(user);
        history.push('/');
      }

      // TODO: Error Message
    });
  }

  return (
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
  );
}

export default LoginForm;
