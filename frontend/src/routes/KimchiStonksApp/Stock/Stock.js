import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import StockGraph from './StockGraph/StockGraph';
import StockOverview from './StockOverview/StockOverview';
import StockUtility from './StockUtility/StockUtility';
import { StockContext } from '../../../contexts/Stock';

import './Stock.scss';

function Stock({ stockSymbol }) {
  const { stock, stockData, retrieveStockData } = useContext(StockContext);

  const { symbol } = useParams();

  useEffect(() => {
    retrieveStockData(symbol, 'DAY');
  }, [symbol]);

  return (
    stock && stockData
      ? (
        <div className="stock-container">
          <div className="left-container">
            <div className="graph-container">
              <StockGraph stockSymbol={stockSymbol} />
            </div>
            <div className="overview-container">
              <StockOverview />
            </div>
          </div>
          <div className="right-container">
            <StockUtility />
          </div>
        </div>
      )
      : null
  );
}

export default Stock;
