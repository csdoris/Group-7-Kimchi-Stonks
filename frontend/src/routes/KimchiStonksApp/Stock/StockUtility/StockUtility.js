import React, { useState, useContext } from 'react';

import InputField from '../../../../components/InputField/InputField';
import Button from '../../../../components/Button/Button';
import { StockContext } from '../../../../contexts/Stock';

import './StockUtility.scss';

function StockUtility({
  amount,
  setAmount,
  setFormSubmitted,
  setBuyStockUnsuccessful,
}) {
  const {
    stock,
    buyStocks,
    stockDayPrediction,
    stockMonthPrediction,
    stockYearPrediction,
  } = useContext(StockContext);

  const [shares, setShares] = useState(0.00);

  const predictions = [
    {
      futureTime: '1 Week',
      predictedPrice: stockDayPrediction,
    },
    {
      futureTime: '1 Month',
      predictedPrice: stockMonthPrediction,
    },
    {
      futureTime: '1 Year',
      predictedPrice: stockYearPrediction,
    },
  ];

  function handleAmountChange(event) {
    const buyingAmount = event.target.value;
    setAmount(buyingAmount);

    const calculatedShares = buyingAmount / stock.currentPrice;
    setShares(calculatedShares);
  }

  function checkInputCharacter(event) {
    if (event.key < '0' || event.key > '9') {
      if (event.keyCode !== 8 && event.keyCode !== 13 && event.keyCode !== 190) {
        event.preventDefault();
      }
    }
  }

  function checkInputValid() {
    const regex = /^\d+(\.\d{1,2})?$/;

    if (regex.test(amount)) {
      return true;
    }
    return false;
  }

  async function handleBuyButtonClick() {
    setFormSubmitted(true);
    const buyStockSuccessful = await buyStocks(shares, stock.currentPrice, amount);
    setBuyStockUnsuccessful(!buyStockSuccessful);
    setShares(0.00);
  }

  return (
    <div className="prediction-purchase-container">
      <div className="prediction-container">
        <p className="container-title">Market Prediction</p>
        <p className="container-info">Before buying, check out the predicted priced for the future!</p>
        <div className="prediction-table">
          {predictions.map((prediction) => (
            <div className="prediction-row" key={prediction.futureTime}>
              <p className="future-time">{prediction.futureTime}</p>
              <p className="predicted-price">{`$${prediction.predictedPrice}`}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="purchase-container">
        <p className="container-title">Market Purchase</p>
        <p className="container-info">Purchase stocks at the current market price.</p>
        <div className="stock-price-row">
          <p className="key">Current price</p>
          <p className="value">{`$${parseFloat(stock.currentPrice).toFixed(2)}`}</p>
        </div>
        <InputField
          className="amount"
          type="text"
          name="amount"
          value={amount}
          placeholder="Amount ($)"
          onKeyDown={(event) => checkInputCharacter(event)}
          onChange={(event) => handleAmountChange(event)}
        />
        <div className="estimation-row">
          <p className="key">Estimated shares</p>
          <p className="value">{shares.toFixed(2)}</p>
        </div>
        <Button
          className="buy"
          type="button"
          value="Buy"
          text="Buy"
          variant="contained"
          disabled={!checkInputValid()}
          onClick={handleBuyButtonClick}
        />
      </div>
    </div>
  );
}

export default StockUtility;
