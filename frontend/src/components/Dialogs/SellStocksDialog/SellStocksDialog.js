import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import Modal from '../../Modal/Modal';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import TextDialog from '../TextDialog/TextDialog';
import { StockContext } from '../../../contexts/Stock';

import logo from '../../../assets/logo.png';

import './SellStocksDialog.scss';

function SellStocksDialog() {
  const history = useHistory();
  const { stock, sellStocks, retrieveStockOverview } = useContext(StockContext);
  const symbol = new URLSearchParams(useLocation().search).get('symbol');
  const totalShares = new URLSearchParams(useLocation().search).get('totalShares');

  const [sharesAmount, setSharesAmount] = useState(undefined);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sellStockUnsucessful, setSellStockUnsuccessful] = useState(false);

  useEffect(() => {
    retrieveStockOverview(symbol);
  }, []);

  function checkInputValid() {
    if (sharesAmount !== undefined && parseFloat(sharesAmount) > 0) {
      return true;
    }
    return false;
  }

  async function handleSellStock() {
    setFormSubmitted(true);
    const sellStockSucessful = await sellStocks(symbol, stock.currentPrice, sharesAmount);
    setSellStockUnsuccessful(!sellStockSucessful);
  }

  return (
    <div>
      {
        formSubmitted
          ? (
            <TextDialog
              title={sellStockUnsucessful ? 'Transaction Unsuccessful' : 'Transaction Successful'}
              text={sellStockUnsucessful ? 'Something occured when trying to sell your stock. Please try again.' : `You have successfully sold ${sharesAmount} of ${symbol}.`}
              onDismiss={history.goBack}
            />
          )
          : (
            <Modal dismissOnClickOutside>
              <div className="modal-header">
                <img className="logo" src={logo} alt="Kimchi Stonks Logo" />
              </div>
              <div className="modal-content">
                <p className="info-title">{`What to sell your ${symbol} stocks?`}</p>
                <p className="info-text">Enter the amount of shares you want to sell below.</p>
                <div className="total-shares-row">
                  <p className="key">Total shares</p>
                  <p className="value">{parseFloat(totalShares).toFixed(2)}</p>
                </div>
                <InputField
                  type="text"
                  name="number-of-shares"
                  value={sharesAmount}
                  placeholder="Number of Shares"
                  onChange={(event) => setSharesAmount(event.target.value)}
                />
                <Button
                  className="sell-stocks"
                  type="button"
                  value="Sell Stocks"
                  text="Sell Stocks"
                  variant="contained"
                  disabled={!checkInputValid()}
                  onClick={handleSellStock}
                />
              </div>
            </Modal>
          )
      }
    </div>
  );
}

export default SellStocksDialog;
