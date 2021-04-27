import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { Table, TableHeader, TableRow } from '../../../components/Table/Table';
import { AuthContext } from '../../../contexts/Auth';

import './Market.scss';

const URL = process.env.REACT_APP_API_URL;

const headers = [
  'Stock',
  'Organisation Name',
  'Price',
  '% Change',
];

function Market() {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/dashboard/trending-stocks`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        const trendingStocks = data.mostGainerStock.slice(0, 9);

        setMarketData(trendingStocks.map((stock) => ({
          symbol: stock.ticker,
          organisation: stock.companyName,
          price: stock.price,
          percentageChange: `${stock.changesPercentage.substring(1, stock.changesPercentage.length - 1)}`,
        })));
      }
    });
  }, []);

  return (
    <div className="market-container">
      <p className="container-title">Trending Stocks</p>
      <Table>
        <TableHeader
          headers={headers}
        />
        {marketData.map((stock) => (
          <TableRow
            key={`trending-${stock.symbol}`}
            rowData={stock}
            onClick={() => history.push(`/stock/${stock.symbol}?period=day`)}
          />
        ))}
      </Table>
    </div>
  );
}

export default Market;
