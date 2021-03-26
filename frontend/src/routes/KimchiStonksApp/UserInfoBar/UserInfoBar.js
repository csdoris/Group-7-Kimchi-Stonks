import React from 'react';

import Button from '../../../components/Button/Button';

import './UserInfoBar.css';

function UserInfoBar() {
  const userInfo = {
    firstName: 'Tim',
    lastName: 'Jones',
    buyingPower: 112.74,
    equityValue: 224.12,
    shares: 3.12,
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
        <div className="info-value">{`$ ${userInfo.equityValue}`}</div>
      </div>
      <div className="info-container">
        <div className="info-title">Buying Power</div>
        <div className="info-value">{`$ ${userInfo.buyingPower}`}</div>
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
        />
      </div>
    </div>
  );
}

export default UserInfoBar;
