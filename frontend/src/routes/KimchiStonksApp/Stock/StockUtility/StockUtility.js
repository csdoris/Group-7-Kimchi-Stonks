import React, { useState } from 'react';

import InputField from '../../../../components/InputField/InputField';
import Button from '../../../../components/Button/Button';

import './StockUtility.scss';

function StockUtility() {
  const [amount, setAmount] = useState(undefined);

  const predictions = [
    {
      futureTime: '1 Week',
      predictedPrice: 145.12,
    },
    {
      futureTime: '1 Month',
      predictedPrice: 159.95,
    },
    {
      futureTime: '1 Year',
      predictedPrice: 178.51,
    },
  ];

  return (
    <div className="prediction-purchase-container">
      <div className="prediction-container">
        <p className="container-title">Market Prediction</p>
        <p className="container-info">Before buying, check out the predicted priced for the future!</p>
        <div className="prediction-table">
          {predictions.map((prediction) => (
            <div className="prediction-row">
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
          onChange={(event) => setAmount(event.target.value)}
        />
        <div className="estimation-row">
          <p className="key">Estimated shares</p>
          <p className="value">0.00</p>
        </div>
        <Button
          className="buy"
          type="button"
          value="Buy"
          text="Buy"
          variant="contained"
        />
      </div>
    </div>
  );
}

export default StockUtility;
