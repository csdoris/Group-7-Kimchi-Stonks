import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Table, TableHeader, TableRow } from '../../../components/Table/Table';
import SellStocksDialog from '../../../components/Dialogs/SellStocksDialog/SellStocksDialog';
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

  const [sellStocks, setSellStocks] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [totalShares, setTotalShares] = useState(0);

  useEffect(() => {
    retrieveUserInfo();
  }, []);

  function handleRowClick(symbol) {
    history.push(`/stock/${symbol}?period=day`);
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Holdings</h1>
      <TableHeader
        headers={headers}
      />
      { user.stocks.length > 0
        ? (
          <Table>
            {user.stocks.map((stock) => (
              <TableRow
                key={`holdings-${stock.symbol}`}
                rowData={{
                  symbol: stock.symbol,
                  shares: stock.shares.toFixed(2),
                  averagePrice: stock.averagePrice.toFixed(2),
                  value: parseFloat(stock.shares * stock.averagePrice).toFixed(2),
                  totalChange: stock.totalChange,
                  action: 'sell',
                }}
                onClick={() => handleRowClick(stock.symbol)}
                setSellStocks={setSellStocks}
                setStockSymbol={setStockSymbol}
                setTotalShares={setTotalShares}
              />
            ))}
          </Table>
        )
        : <p>No Holdings :(</p>}
      {
        sellStocks
          ? (
            <SellStocksDialog
              onDismiss={() => setSellStocks(false)}
              symbol={stockSymbol}
              totalShares={totalShares}
            />
          )
          : null
      }
    </div>
  );
}

export default Dashboard;
