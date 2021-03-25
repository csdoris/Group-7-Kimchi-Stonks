import React, { useState } from 'react';

import InputField from '../../../components/InputField/InputField';

import logo from '../../../assets/logo.png';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="auth-form">
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
      <InputField type="submit" value="Submit" />
    </form>
  );
}

export default LoginForm;
