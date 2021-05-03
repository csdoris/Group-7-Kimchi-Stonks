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
  const { user, updateUser } = useContext(AuthContext);

  const [stock, setStock] = useState(undefined);
  const [stockData, setStockData] = useState(undefined);
  const [stockDayPrediction, setDayPrediction] = useState(undefined);
  const [stockMonthPrediction, setMonthPrediction] = useState(undefined);
  const [stockYearPrediction, setYearPrediction] = useState(undefined);

  function clearStock() {
    setStock(undefined);
    setStockData(undefined);
  }

  function predictStock(symbol) {
    // Day price prediction
    axios.get(`${URL}/dashboard/predict-price/${symbol}?days=0`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        if (data.prediction == null) {
          setDayPrediction('N/A');
        } else {
          setDayPrediction(data.prediction);
        }
      } else {
        setDayPrediction('N/A');
      }
    });

    // One week price prediction
    axios.get(`${URL}/dashboard/predict-price/${symbol}?days=30`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        if (data.prediction == null) {
          setMonthPrediction('N/A');
        } else {
          setMonthPrediction(data.prediction);
        }
      } else {
        setMonthPrediction('N/A');
      }
    });

    // One year price prediction
    axios.get(`${URL}/dashboard/predict-price/${symbol}?days=365`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        if (data.prediction == null) {
          setYearPrediction('N/A');
        } else {
          setYearPrediction(data.prediction);
        }
      } else {
        setYearPrediction('N/A');
      }
    });
  }

  function retrieveStockOverview(symbol) {
    // Get stock overview
    axios.get(`${URL}/dashboard/stock-overview/${symbol}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        predictStock(symbol);
        setStock(data);
      }
    });
  }

  function retrieveStockData(symbol, period) {
    const timePeriod = TIME_PERIOD_MAP[period];
    axios.get(`${URL}/dashboard/time-series/${timePeriod}/${symbol}`, {
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

  async function buyStocks(shares, stockPrice, totalSpent) {
    try {
      const res = await axios.post(`${URL}/user/buy`, {
        symbol: stock.symbol,
        shares,
        stockPrice,
        totalSpent,
      }, {
        headers: {
          Authorization: `Bearer ${user.accessToken.token}`,
        },
      });

      const { status, data } = res;
      if (status === 200) {
        // Show dialog confirming buy was successful.
        const { user: updatedUser } = data;
        updateUser(updatedUser);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  async function sellStocks(symbol, stockPrice, sellingAmount) {
    try {
      const res = await axios.post(`${URL}/user/sell`, {
        symbol,
        stockPrice,
        sellingAmount,
      }, {
        headers: {
          Authorization: `Bearer ${user.accessToken.token}`,
        },
      });

      const { status, data } = res;

      if (status === 200) {
        const { user: updatedUser } = data;
        updateUser(updatedUser);
        // Show dialog confirming buy was successful.
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  const context = {
    stock,
    stockData,
    stockDayPrediction,
    stockMonthPrediction,
    stockYearPrediction,
    clearStock,
    retrieveStockOverview,
    retrieveStockData,
    buyStocks,
    sellStocks,
  };

  return (
    <StockContext.Provider value={context}>
      {children}
    </StockContext.Provider>
  );
}

export { StockContext, StockProvider };
