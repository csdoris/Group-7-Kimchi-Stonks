import React, { useContext } from 'react';

import Button from '../../../components/Button/Button';
import { AuthContext } from '../../../contexts/Auth';

import './UserInfoBar.scss';

function UserInfoBar({ setAddBuyingPower }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="user-info-bar-container">
      <div className="user-profile-icon">
        <div className="user-letter">{user.firstName.charAt(0)}</div>
      </div>
      <div className="name-account-container">
        <p className="name">{`${user.firstName} ${user.lastName}`}</p>
        <p className="account">Individual Account</p>
      </div>
      <div className="info-container">
        <div className="info-title">Total Equity</div>
        <div className="info-value">
          {`$${user.totalEquity.toFixed(2)}`}
        </div>
      </div>
      <div className="info-container">
        <div className="info-title">Buying Power</div>
        <div className="info-value">{`$${user.buyingPower.toFixed(2)}`}</div>
      </div>
      <div className="button-container">
        <Button
          className="buying-power"
          type="button"
          value="Get Buying Power"
          text="Get Buying Power"
          variant="text"
          onClick={setAddBuyingPower}
        />
      </div>
    </div>
  );
}

export default UserInfoBar;
