import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Table from '../../../components/Table/Table';
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
        const trendingStocks = data.mostGainerStock.slice(0, 10);

        setMarketData(trendingStocks.map((stock) => ({
          stock: stock.ticker,
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
      <Table headers={headers} data={marketData} />
    </div>
  );
}

export default Market;
