import React, { useState } from 'react';

import InputField from './../../../components/InputField/InputField';

function RegisterForm() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfrimPassword] = useState('');

  return (
    <form>
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
      <input type="submit" value="Submit" />
    </form>
  );
}

export default RegisterForm;
