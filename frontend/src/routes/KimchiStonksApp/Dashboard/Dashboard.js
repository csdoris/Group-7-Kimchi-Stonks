import React, { useContext } from 'react';

import Table from '../../../components/Table/Table';
import { AuthContext } from '../../../contexts/Auth';

import './Dashboard.scss';

function Dashboard() {
  const { user } = useContext(AuthContext);

  console.log(user);

  const headers = [
    'Stock',
    'Shares',
    'Avg. Price',
    'Value',
    'Day Change',
    'Total Change',
    '',
  ];

  // const data = [
  //   {
  //     stock: 'AMD',
  //     shares: '1.00',
  //     avgPrice: '$95.50',
  //     value: '$76.27',
  //     dayChange: '-$0.26 (-0.34%)',
  //     totalChange: '-$18.99 (-19.93%)',
  //     action: 'SELL',
  //   },
  //   {
  //     stock: 'DBX',
  //     shares: '1.00',
  //     avgPrice: '$95.50',
  //     value: '$76.27',
  //     dayChange: '+$0.26 (-0.34%)',
  //     totalChange: '+$18.99 (-19.93%)',
  //     action: 'SELL',
  //   },
  //   {
  //     stock: 'TSLA',
  //     shares: '1.00',
  //     avgPrice: '$595.50',
  //     value: '$76.27',
  //     dayChange: '+$0.26 (-0.34%)',
  //     totalChange: '+$18.99 (-19.93%)',
  //     action: 'SELL',
  //   },
  // ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Holdings</h1>
      <Table headers={headers} data={user.stocks} />
    </div>
  );
}

export default Dashboard;
