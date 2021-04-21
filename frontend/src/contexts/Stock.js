import React, { useState } from 'react';
import axios from 'axios';

import { AuthContext } from 'Auth';

const StockContext = React.createContext();

const url = process.env.REACT_APP_API_URL;

function AuthProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [stockData, setStockData] = useState(undefined);

  function retrieveStockData(stockSymbol, period) {
    // Get stock overview

    const timePeriod = [period];
    axios.get(`${url}/dashboard/time-series/${timePeriod}/${stockSymbol}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;

      if (status === 200) {
        console.log(data);
      }
    });
  }

  const context = {
    stockData,
    retrieveStockData,
  };

  return (
    <StockContext.Provider value={context}>
      {children}
    </StockContext.Provider>
  );
}

export { StockContext, StockProvider };
