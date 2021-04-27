import React, { useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from './Auth';

const StockContext = React.createContext();

const URL = process.env.REACT_APP_API_URL;

const TIME_PERIOD_MAP = {
  day: 'intraday',
  week: 'daily',
  month: 'monthly',
  year: 'yearly',
};

function StockProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [stock, setStock] = useState(undefined);
  const [stockData, setStockData] = useState(undefined);

  function clearStock() {
    setStock(undefined);
    setStockData(undefined);
  }

  function retrieveStockData(stockSymbol, period) {
    // Get stock overview
    axios.get(`${URL}/dashboard/stock-overview/${stockSymbol}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        setStock(data);
      }
    });

    const timePeriod = TIME_PERIOD_MAP[period];
    axios.get(`${URL}/dashboard/time-series/${timePeriod}/${stockSymbol}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        setStockData(data);
      }
    });
  }

  function buyStocks(shares, stockPrice, totalSpent) {
    axios.post(`${URL}/user/buy`, {
      symbol: stock.Symbol,
      shares,
      stockPrice,
      totalSpent,
    }, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        console.log(res);
        console.log(data);
      }
    });
  }

  const context = {
    stock,
    stockData,
    clearStock,
    retrieveStockData,
    buyStocks,
  };

  return (
    <StockContext.Provider value={context}>
      {children}
    </StockContext.Provider>
  );
}

export { StockContext, StockProvider };
