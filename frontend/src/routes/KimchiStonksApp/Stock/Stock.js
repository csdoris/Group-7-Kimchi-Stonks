import React from 'react';

import StockGraph from './StockGraph/StockGraph';
import StockUtility from './StockUtility/StockUtility';

import './Stock.scss';

function Stock() {
  return (
    <div className="stock-container">
      <div className="left-container">
        <div className="graph-container">
          <StockGraph />
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
