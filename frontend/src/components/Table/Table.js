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
          {data.map((el) => (
            <div className="table-row" key={el.stock} onClick={() => handleRowClick(el.stock)}>
              {Object.keys(el).map((keyName) => (
                <div
                  className={`table-value ${keyName} ${
                    el[keyName][0] === '+' ? 'positive' : ''
                  }
                  ${el[keyName][0] === '-' ? 'negative' : ''}`}
                  key={`${el.stock}-${keyName}`}
                  onClick={handleSellButtonClick}
                >
                  {el[keyName]}
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
