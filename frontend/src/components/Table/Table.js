import React from 'react';

import './Table.scss';

function Table({ children }) {
  return <div className="table">{children}</div>;
}

function TableHeader({ headers }) {
  return (
    <div className="header-container">
      {headers.map((header) => (
        <div className="header" key={header}>{header}</div>
      ))}
    </div>
  );
}

function TableRow({
  rowData,
  onClick,
  setSellStocks,
  setStockSymbol,
  setTotalShares,
}) {
  function handleSellButtonClick(event, symbol, totalShares) {
    event.stopPropagation();
    setStockSymbol(symbol);
    setTotalShares(totalShares);
    setSellStocks(true);
  }

  return (
    <div className="table-row" key={rowData.symbol} onClick={onClick}>
      {Object.keys(rowData).map((key) => (
        <div
          className={`table-value ${key} ${
            rowData[key][0] === '+' ? 'positive' : ''
          }
          ${rowData[key][0] === '-' ? 'negative' : ''}`}
          key={`${rowData.symbol}-${key}`}
          onClick={key === 'action' ? (event) => handleSellButtonClick(event, rowData.symbol, rowData.shares) : null}
        >
          {rowData[key]}
        </div>
      ))}
    </div>
  );
}

export default Table;

export { Table, TableHeader, TableRow };
