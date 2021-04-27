import React, { useContext } from 'react';

import { StockContext } from '../../../../contexts/Stock';

function StockOverview() {
  const { stock } = useContext(StockContext);

  return (
    <div className="inner-overview-container">
      <div className="overview-header-container">
        <div className="container-title">
          Overview
        </div>
      </div>
      <div className="grid-container">
        <div className="grid-item">
          <p className="info-title">Name:</p>
          <p className="info-text">{stock.Name}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">Symbol:</p>
          <p className="info-text">{stock.Symbol}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">Country:</p>
          <p className="info-text">{stock.Country}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">Currency:</p>
          <p className="info-text">{stock.Currency}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">52 Week High:</p>
          <p className="info-text">{parseFloat(stock['52WeekHigh']).toFixed(2)}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">52 Week Low:</p>
          <p className="info-text">{parseFloat(stock['52WeekLow']).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default StockOverview;
