import React from 'react';

import './TableRow.scss';

function TableRow({ holding }) {
  const
    {
      stock, shares, avgPrice, value, dayChange, totalChange, action,
    } = holding;
  return (
    <div className="table-row flex-grid">
      <div className="col">{stock}</div>
      <div className="col">{shares}</div>
      <div className="col">{avgPrice}</div>
      <div className="col">{value}</div>
      <div className="col">{dayChange}</div>
      <div className="col">{totalChange}</div>
      <div className="col action">{action}</div>
    </div>
  );
}

export default TableRow;
