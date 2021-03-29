import React from 'react';
import './TableHeader.scss';

function TableHeader({ titles }) {
  return (
    <div className="table-header flex-grid">
      {titles.map((title) => (
        <div className="col">{title}</div>
      ))}
    </div>
  );
}

export default TableHeader;
