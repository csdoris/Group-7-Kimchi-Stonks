import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import Button from '../../../components/Button/Button';

import './UserInfoBar.scss';

function UserInfoBar() {
  const history = useHistory();
  const location = useLocation();

  const userInfo = {
    firstName: 'Tim',
    lastName: 'Jones',
    buyingPower: 12.74,
    equityValue: 824.12,
    shares: 43.12,
  };

  return (
    <div className="user-info-bar-container">
      <div className="user-profile-icon">
        <p className="user-letter">{userInfo.firstName.charAt(0)}</p>
      </div>
      <div className="name-account-container">
        <p className="name">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
        <p className="account">Individual Account</p>
      </div>
      <div className="info-container">
        <div className="info-title">Equity Value</div>
        <div className="info-value">{`$${userInfo.equityValue}`}</div>
      </div>
      <div className="info-container">
        <div className="info-title">Buying Power</div>
        <div className="info-value">{`$${userInfo.buyingPower}`}</div>
      </div>
      <div className="info-container">
        <div className="info-title">Shares</div>
        <div className="info-value">{userInfo.shares}</div>
      </div>
      <div className="button-container">
        <Button
          className="buying-power"
          type="button"
          value="Get Buying Power"
          text="Get Buying Power"
          variant="text"
          onClick={() => history.push(`${location.pathname}/addBuyingPower`)}
        />
      </div>
    </div>
  );
}

export default UserInfoBar;
