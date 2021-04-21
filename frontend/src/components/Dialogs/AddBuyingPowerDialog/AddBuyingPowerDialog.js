import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Modal from '../../Modal/Modal';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { AuthContext } from '../../../contexts/Auth';

import logo from '../../../assets/logo.png';

import './AddBuyingPowerDialog.scss';

const url = process.env.REACT_APP_API_URL;

function AddBuyingPowerDialog() {
  const history = useHistory();

  const { user, updateUser } = useContext(AuthContext);

  const [amount, setAmount] = useState(undefined);

  function handleAddBuyingPower() {
    axios.post(`${url}/user/add`, { amount }, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;
      const { user: updatedUser } = data;

      if (status === 200) {
        updateUser(updatedUser);
        history.goBack();
      }

      // TODO: Error Message
    });
  }

  return (
    <Modal dismissOnClickOutside>
      <div className="modal-header">
        <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
      </div>
      <div className="modal-content">
        <p className="info-title">Need more buying power?</p>
        <p className="info-text">Enter an amount below to add more buying power to your account.</p>
        <InputField
          type="text"
          name="amount"
          value={amount}
          placeholder="Amount"
          onChange={(event) => setAmount(event.target.value)}
        />
        <Button
          className="add-buying-power"
          type="button"
          value="Add Buying Power"
          text="Add Buying Power"
          variant="contained"
          onClick={handleAddBuyingPower}
        />
      </div>
    </Modal>
  );
}

export default AddBuyingPowerDialog;
