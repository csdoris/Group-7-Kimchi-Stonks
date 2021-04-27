import React, { useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import Button from '../../../components/Button/Button';
import { AuthContext } from '../../../contexts/Auth';

import './UserInfoBar.scss';

function UserInfoBar() {
  const history = useHistory();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <div className="user-info-bar-container">
      <div className="user-profile-icon">
        <p className="user-letter">{user.firstName.charAt(0)}</p>
      </div>
      <div className="name-account-container">
        <p className="name">{`${user.firstName} ${user.lastName}`}</p>
        <p className="account">Individual Account</p>
      </div>
      <div className="info-container">
        <div className="info-title">Equity Value</div>
        <div className="info-value">{`$${user.equityValue ? user.equityValue : 0}`}</div>
      </div>
      <div className="info-container">
        <div className="info-title">Buying Power</div>
        <div className="info-value">{`$${user.buyingPower.toFixed(2)}`}</div>
      </div>
      <div className="info-container">
        <div className="info-title">Shares</div>
        <div className="info-value">{user.shares ? user.shares : 0}</div>
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
