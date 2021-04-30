import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Modal from '../../Modal/Modal';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import TextDialog from '../TextDialog/TextDialog';
import { AuthContext } from '../../../contexts/Auth';

import logo from '../../../assets/logo.png';

import './AddBuyingPowerDialog.scss';

const url = process.env.REACT_APP_API_URL;

function AddBuyingPowerDialog() {
  const history = useHistory();

  const { user, updateUser } = useContext(AuthContext);

  const [amount, setAmount] = useState(undefined);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [addBuyingPowerUnsucessful, setAddBuyingPowerUnsuccessful] = useState(false);

  async function handleAddBuyingPower() {
    setFormSubmitted(true);
    try {
      const res = await axios.post(`${url}/user/add`, { amount }, {
        headers: {
          Authorization: `Bearer ${user.accessToken.token}`,
        },
      });

      const { status, data } = res;
      const { user: updatedUser } = data;

      if (status === 200) {
        updateUser(updatedUser);
      }
    } catch (err) {
      setAddBuyingPowerUnsuccessful(true);
    }
  }

  return (
    <div>
      {
        formSubmitted
          ? (
            <TextDialog
              title={addBuyingPowerUnsucessful ? 'Transaction Unsuccessful' : 'Transaction Successful'}
              text={addBuyingPowerUnsucessful ? 'Something occured when trying to add buying power to your account. Please try again.' : `You have successfully added $${amount}.00 to your account.`}
              onDismiss={history.goBack}
            />
          )
          : (
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
          )
      }
    </div>
  );
}

export default AddBuyingPowerDialog;
