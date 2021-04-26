import React from 'react';
import './Table.scss';

function TableHeader() {
  const titles = [
    'STOCK',
    'SHARES',
    'AVG PRICE',
    'VALUE',
    'DAY CHANGE',
    'TOTAL CHANGE',
    'ACTION',
  ];

  const holdingsList = [
    {
      stock: 'AMD',
      shares: '1.00',
      avgPrice: '$95.50',
      value: '$76.27',
      dayChange: '-$0.26 (-0.34%)',
      totalChange: '-$18.99 (-19.93%)',
      action: 'SELL',
    },
    {
      stock: 'DBX',
      shares: '1.00',
      avgPrice: '$95.50',
      value: '$76.27',
      dayChange: '+$0.26 (-0.34%)',
      totalChange: '+$18.99 (-19.93%)',
      action: 'SELL',
    },
    {
      stock: 'TSLA',
      shares: '1.00',
      avgPrice: '$595.50',
      value: '$76.27',
      dayChange: '+$0.26 (-0.34%)',
      totalChange: '+$18.99 (-19.93%)',
      action: 'SELL',
    },
  ];

  const handleClick = () => null;

  return (
    <div className="table">
      <div className="table-header flex-grid">
        {titles.map((title) => (
          <div className="col">{title}</div>
        ))}
      </div>
      {holdingsList.map((holding) => (
        <div className="table-row flex-grid">
          {Object.keys(holding).map((keyName) => (
            <div
              className={`col ${keyName} ${
                holding[keyName][0] === '+' ? 'positive' : ''
              }
              ${holding[keyName][0] === '-' ? 'negative' : ''}`}
              onClick={handleClick}
            >
              {holding[keyName]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableHeader;
