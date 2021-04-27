import React from 'react';

import Table from '../../../components/Table/Table';

import './Dashboard.scss';

function Dashboard() {
  const headers = [
    'STOCK',
    'SHARES',
    'AVG PRICE',
    'VALUE',
    'DAY CHANGE',
    'TOTAL CHANGE',
    'ACTION',
  ];

  const data = [
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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Holdings</h1>
      <Table headers={headers} data={data} />
    </div>
  );
}

export default Dashboard;
