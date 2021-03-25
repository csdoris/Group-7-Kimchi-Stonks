import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';

import logo from '../../../assets/logo.png';

function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleRegisterForm() {

  }

  return (
    <form className="auth-form">
      <div className="form-content">
        <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
        <InputField
          type="text"
          name="first-name"
          value={firstName}
          placeholder="First Name"
          onChange={(event) => setFirstName(event.target.value)}
        />
        <InputField
          type="text"
          name="last-name"
          value={lastName}
          placeholder="Last Name"
          onChange={(event) => setLastName(event.target.value)}
        />
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
        <InputField
          type="password"
          name="confirm-password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <Button
          className="submit"
          type="submit"
          value="Submit"
          text="Register"
          variant="contained"
        />
      </div>
      <div className="form-footer">
        <p>Already have an account?</p>
        <Link className="button text" to="/auth/login">
          Login here
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;
