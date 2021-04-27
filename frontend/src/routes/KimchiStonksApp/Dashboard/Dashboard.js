import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Table, TableHeader, TableRow } from '../../../components/Table/Table';
import { AuthContext } from '../../../contexts/Auth';

import './Dashboard.scss';

const headers = [
  'Stock',
  'Shares',
  'Avg. Price',
  'Value',
  'Total Change',
  '',
];

function Dashboard() {
  const history = useHistory();
  const { user, retrieveUserInfo } = useContext(AuthContext);

  useEffect(() => {
    retrieveUserInfo();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Holdings</h1>
      { user.stocks.length > 0
        ? (
          <Table>
            <TableHeader
              headers={headers}
            />
            {user.stocks.map((stock) => (
              <TableRow
                key={`holdings-${stock.symbol}`}
                rowData={{
                  symbol: stock.symbol,
                  shares: stock.shares.toFixed(2),
                  averagePrice: stock.averagePrice.toFixed(2),
                  value: parseFloat(stock.shares * stock.averagePrice).toFixed(2),
                  totalChange: '+135.12 (+0.25%)',
                  action: 'sell',
                }}
                onClick={() => history.push(`/stock/${stock.symbol}?period=day`)}
              />
            ))}
          </Table>
        )
        : <p>No Holdings :(</p>}
    </div>
  );
}

export default Dashboard;
