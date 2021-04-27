import React from 'react';
import './Table.scss';

function TableHeader({ headers, data }) {
  function handleClick() {}

  return (
    <div className="table">
      <div className="table-header flex-grid">
        {headers.map((header) => (
          <div className="col" key={header}>{header}</div>
        ))}
      </div>
      {data.map((el) => (
        <div className="table-row flex-grid" key={el.stock}>
          {Object.keys(el).map((keyName) => (
            <div
              className={`col ${keyName} ${
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
  );
}

export default TableHeader;
