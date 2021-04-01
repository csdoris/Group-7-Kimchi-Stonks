import React from 'react';

import StockUtility from './StockUtility/StockUtility';

import './Stock.scss';

function Stock() {
  return (
    <div className="stock-container">
      <div className="left-container">
        <div className="graph-container">
          <p>Top</p>
        </div>
        <div className="overview-container">
          <p>Bottom</p>
        </div>
      </div>
      <div className="right-container">
        <StockUtility />
      </div>
    </div>
  );
}

export default Stock;
