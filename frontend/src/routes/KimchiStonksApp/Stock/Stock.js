import React from 'react';

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
        <p>Right</p>
      </div>
    </div>
  );
}

export default Stock;
