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
          <p className="info-text">{stock.name}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">Symbol:</p>
          <p className="info-text">{stock.symbol}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">Volume:</p>
          <p className="info-text">{stock.volume}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">Market Cap:</p>
          <p className="info-text">{stock.marketCap}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">52 Week High:</p>
          <p className="info-text">{parseFloat(stock.yearHigh).toFixed(2)}</p>
        </div>
        <div className="grid-item">
          <p className="info-title">52 Week Low:</p>
          <p className="info-text">{parseFloat(stock.yearLow).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default StockOverview;
