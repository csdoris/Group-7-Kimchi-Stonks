import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Modal from '../../Modal/Modal';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';

import logo from '../../../assets/logo.png';

import './AddBuyingPowerDialog.scss';

function AddBuyingPowerDialog() {
  const history = useHistory();

  const [amount, setAmount] = useState(undefined);

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
          onClick={history.goBack}
        />
      </div>
    </Modal>
  );
}

export default AddBuyingPowerDialog;
