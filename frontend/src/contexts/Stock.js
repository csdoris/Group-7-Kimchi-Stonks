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
  const [stockDayPrediction, setDayPrediction] = useState(undefined);
  const [stockMonthPrediction, setMonthPrediction] = useState(undefined);
  const [stockYearPrediction, setYearPrediction] = useState(undefined);

  function clearStock() {
    setStock(undefined);
    setStockData(undefined);
  }

<<<<<<< HEAD
  function predictStock(stockSymbol) {
    // Day price prediction
    axios.get(`${URL}/dashboard/predict-price/${stockSymbol}?days=0`, {
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
    axios.get(`${URL}/dashboard/predict-price/${stockSymbol}?days=30`, {
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
    axios.get(`${URL}/dashboard/predict-price/${stockSymbol}?days=365`, {
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

  function retrieveStockData(stockSymbol, period) {
=======
  function retrieveStockOverview(symbol) {
>>>>>>> added sell stocks modal and connected to api
    // Get stock overview
    axios.get(`${URL}/dashboard/stock-overview/${symbol}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        predictStock(stockSymbol);
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
      const { status } = res;

      if (status === 200) {
        // Show dialog confirming buy was successful.
      }
    });
  }

  function sellStocks(symbol, stockPrice, sellingAmount) {
    axios.post(`${URL}/user/sell`, {
      symbol,
      stockPrice,
      sellingAmount,
    }, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status } = res;

      if (status === 200) {
        // Show dialog confirming buy was successful.
      }
    });
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
