import React from 'react';
import { useHistory } from 'react-router-dom';

import './Table.scss';

function TableHeader({ headers, data }) {
  const history = useHistory();

  function handleRowClick(symbol) {
    history.push(`/stock/${symbol}?period=day`);
  }

  function handleSellButtonClick() {

  }

  return (
    data.length > 0
      ? (
        <div className="table">
          <div className="header-container">
            {headers.map((header) => (
              <div className="header" key={header}>{header}</div>
            ))}
          </div>
          {data.map((stock) => (
            <div className="table-row" key={stock.symbol} onClick={() => handleRowClick(stock.symbol)}>
              {Object.keys(stock).map((keyName) => (
                <div
                  className={`table-value ${keyName} ${
                    stock[keyName][0] === '+' ? 'positive' : ''
                  }
                  ${stock[keyName][0] === '-' ? 'negative' : ''}`}
                  key={`${stock.symbol}-${keyName}`}
                  onClick={handleSellButtonClick}
                >
                  {stock[keyName]}
                </div>
              ))}
            </div>
          ))}
        </div>
      )
      : <p>No Data</p>
  );
}

export default TableHeader;
