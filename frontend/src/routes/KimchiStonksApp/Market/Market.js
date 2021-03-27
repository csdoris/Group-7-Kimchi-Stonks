import React from 'react';

import './Market.css';

function Market() {
  return (
    <div className="market-container">
      <div className="left-container">
        <p className="container-title">Most Up</p>
      </div>
      <div className="right-container">
        <p className="container-title">Most Down</p>
      </div>
    </div>
  );
}

export default Market;
