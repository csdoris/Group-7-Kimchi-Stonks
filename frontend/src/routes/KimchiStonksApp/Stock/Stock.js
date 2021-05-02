import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Loading from '../../../components/Loading/Loading';
import StockGraph from './StockGraph/StockGraph';
import StockOverview from './StockOverview/StockOverview';
import StockUtility from './StockUtility/StockUtility';
import TextDialog from '../../../components/Dialogs/TextDialog/TextDialog';
import { StockContext } from '../../../contexts/Stock';

import './Stock.scss';

function Stock({ stockSymbol }) {
  const {
    stock, stockData, retrieveStockOverview, retrieveStockData,
  } = useContext(StockContext);
  const period = new URLSearchParams(useLocation().search).get('period');

  const { symbol } = useParams();

  const [amount, setAmount] = useState(undefined);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [buyStockUnsucessful, setBuyStockUnsuccessful] = useState(false);

  useEffect(() => {
    retrieveStockOverview(symbol);
    retrieveStockData(symbol, period);
  }, [symbol, period]);

  return (
    stock && stockData
      ? (
        <div>
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
              <StockUtility
                amount={amount}
                setAmount={setAmount}
                setFormSubmitted={setFormSubmitted}
                setBuyStockUnsuccessful={setBuyStockUnsuccessful}
              />
            </div>
          </div>
          {
            formSubmitted
              ? (
                <TextDialog
                  title={buyStockUnsucessful ? 'Transaction Unsuccessful' : 'Transaction Successful'}
                  text={buyStockUnsucessful ? `Something occured when trying to buy ${symbol} stock. You may have insufficent funds. Please try again.` : `You have successfully bought $${amount} of ${symbol}.`}
                  onDismiss={() => setFormSubmitted(false)}
                />
              )
              : null
          }
        </div>
      )
      : <Loading />
  );
}

export default Stock;
