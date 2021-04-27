import React, { useState, useContext } from 'react';

import InputField from '../../../../components/InputField/InputField';
import Button from '../../../../components/Button/Button';
import { StockContext } from '../../../../contexts/Stock';

import './StockUtility.scss';

function StockUtility() {
  const { stock, buyStocks } = useContext(StockContext);
  const {
    stockDayPrediction,
    stockMonthPrediction,
    stockYearPrediction,
  } = useContext(StockContext);

  const [amount, setAmount] = useState(undefined);
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

    const calculatedShares = buyingAmount / stock['50DayMovingAverage'];
    setShares(calculatedShares);
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
        <InputField
          className="amount"
          type="text"
          name="amount"
          value={amount}
          placeholder="Amount ($)"
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
          onClick={() => buyStocks(shares, stock['50DayMovingAverage'], amount)}
        />
      </div>
    </div>
  );
}

export default StockUtility;
