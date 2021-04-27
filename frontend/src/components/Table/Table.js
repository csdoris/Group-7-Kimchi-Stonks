import React from 'react';
import './Table.scss';

function TableHeader({ headers, data }) {
  function handleClick() {}

  return (
    data.length > 0
      ? (
        <div className="table">
          <div className="header-container flex-grid">
            {headers.map((header) => (
              <div className="header" key={header}>{header}</div>
            ))}
          </div>
          {data.map((el) => (
            <div className="table-row flex-grid" key={el.stock}>
              {Object.keys(el).map((keyName) => (
                <div
                  className={`table-value ${keyName} ${
                    el[keyName][0] === '+' ? 'positive' : ''
                  }
                  ${el[keyName][0] === '-' ? 'negative' : ''}`}
                  key={`${el.stock}-${keyName}`}
                  onClick={handleClick}
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
