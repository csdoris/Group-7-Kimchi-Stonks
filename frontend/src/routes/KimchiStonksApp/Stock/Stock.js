import React, { useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import StockGraph from './StockGraph/StockGraph';
import StockOverview from './StockOverview/StockOverview';
import StockUtility from './StockUtility/StockUtility';
import { StockContext } from '../../../contexts/Stock';

import './Stock.scss';

function Stock({ stockSymbol }) {
  const {
    stock, stockData, retrieveStockOverview, retrieveStockData,
  } = useContext(StockContext);
  const period = new URLSearchParams(useLocation().search).get('period');

  const { symbol } = useParams();

  useEffect(() => {
    retrieveStockOverview(symbol);
    retrieveStockData(symbol, period);
  }, [symbol, period]);

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
