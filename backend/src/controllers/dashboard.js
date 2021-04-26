const axios = require('axios');

const TIME_SERIES_INTRADAY = 0;
const TIME_SERIES_DAILY = 1;
const TIME_SERIES_WEEKLY = 2;
const TIME_SERIES_MONTHLY = 3;

/**
 * Formats response from Alpha Vantage in format more useful for client.
 *
 * @param  {Object} data     Alpha Vantage API repsonse data
 * @param  {Object} interval Data interval
 */
function formatReturnData(data, interval) {
  let intervalText;
  let timeSeries;
  switch (interval) {
    case TIME_SERIES_INTRADAY:
      intervalText = data['Meta Data']['4. Interval'];
      timeSeries = data['Time Series (60min)'];
      break;
    case TIME_SERIES_DAILY:
      intervalText = 'Daily';
      timeSeries = data['Time Series (Daily)'];
      break;
    case TIME_SERIES_WEEKLY:
      intervalText = 'Weekly';
      timeSeries = data['Weekly Time Series'];
      break;
    case TIME_SERIES_MONTHLY:
      intervalText = 'Monthly';
      timeSeries = data['Monthly Time Series'];
      break;
    default:
  }

  const metaData = {
    symbol: data['Meta Data']['2. Symbol'].toUpperCase(),
    interval: intervalText,
  };

  const timeSeriesData = [];
  Object.keys(timeSeries).forEach((key) => {
    const dataPoint = {
      dateTime: key,
      xAxis: '',
      open: timeSeries[key]['1. open'],
      high: timeSeries[key]['2. high'],
      low: timeSeries[key]['3. low'],
      close: timeSeries[key]['4. close'],
      volume: timeSeries[key]['5. volume'],
    };

    switch (interval) {
      case TIME_SERIES_INTRADAY:
        dataPoint.xAxis = key.substr(11, 5);
        break;
      case TIME_SERIES_DAILY:
        dataPoint.xAxis = new Date(key).toLocaleDateString('en-us', { weekday: 'long' });
        break;
      case TIME_SERIES_WEEKLY:
        dataPoint.xAxis = key;
        break;
      case TIME_SERIES_MONTHLY:
        dataPoint.xAxis = new Date(key).toLocaleDateString('en-us', { month: 'long' });
        break;
      default:
    }

    timeSeriesData.push(dataPoint);
  });

  return {
    metaData,
    timeSeriesData,
  };
}

/**
 * Gets the stock overview for the stock symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getStockOverview(req, res) {
  const { symbol } = req.params;

  const url = `${process.env.AV_DOMAIN}/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns empty object if stock symbol is invalid
    if (!Object.keys(response.data).length) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(response.status).json(response.data);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets the intraday (60 min resolution, 10:00-16:00) stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesIntraday(req, res) {
  const { symbol } = req.params;

  const url = `${process.env.AV_DOMAIN}/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns object with 'Error Message' property if symbol is invalid
    if (Object.prototype.hasOwnProperty.call(response.data, 'Error Message')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      const returnObject = formatReturnData(response.data, TIME_SERIES_INTRADAY);

      const todayDate = returnObject.timeSeriesData[0].dateTime.substr(0, 10);
      const start = `${todayDate} 10:00:00`;
      const end = `${todayDate} 16:00:00`;

      const validObjects = [];
      returnObject.timeSeriesData.forEach((el) => {
        if (el.dateTime >= start && el.dateTime <= end) {
          validObjects.push(el);
        }
      });

      returnObject.timeSeriesData = validObjects.reverse();

      res.status(response.status).json(returnObject);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets the daily stock time series (5 days) for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesDaily(req, res) {
  const { symbol } = req.params;

  const url = `${process.env.AV_DOMAIN}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns object with 'Error Message' property if symbol is invalid
    if (Object.prototype.hasOwnProperty.call(response.data, 'Error Message')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      const returnObject = formatReturnData(response.data, TIME_SERIES_DAILY);
      if (returnObject.timeSeriesData.length > 5) {
        returnObject.timeSeriesData = returnObject.timeSeriesData.slice(0, 5);
      }
      returnObject.timeSeriesData.reverse();
      res.status(response.status).json(returnObject);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets the weekly stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesWeekly(req, res) {
  const { symbol } = req.params;

  const url = `${process.env.AV_DOMAIN}/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns object with 'Error Message' property if symbol is invalid
    if (Object.prototype.hasOwnProperty.call(response.data, 'Error Message')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      const returnObject = formatReturnData(response.data, TIME_SERIES_WEEKLY);
      returnObject.timeSeriesData.reverse();
      res.status(response.status).json(returnObject);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets the monthly stock time series (12 months) for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesMonthly(req, res) {
  const { symbol } = req.params;

  const url = `${process.env.AV_DOMAIN}/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns object with 'Error Message' property if symbol is invalid
    if (Object.prototype.hasOwnProperty.call(response.data, 'Error Message')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      const returnObject = formatReturnData(response.data, TIME_SERIES_MONTHLY);
      if (returnObject.timeSeriesData.length > 12) {
        returnObject.timeSeriesData = returnObject.timeSeriesData.slice(0, 12);
      }
      returnObject.timeSeriesData.reverse();
      res.status(response.status).json(returnObject);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets the yearly stock time series (up to 10y) for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesYearly(req, res) {
  const { symbol } = req.params;

  // AV API does not have yearly interval, need to hack monthly data
  const url = `${process.env.AV_DOMAIN}/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns object with 'Error Message' property if symbol is invalid
    if (Object.prototype.hasOwnProperty.call(response.data, 'Error Message')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      const returnObject = formatReturnData(response.data, TIME_SERIES_MONTHLY);
      returnObject.metaData.interval = 'Yearly';

      const validTimeSeries = [];
      for (let i = 0; i < returnObject.timeSeriesData.length && validTimeSeries.length < 10; i += 12) {
        const temp = returnObject.timeSeriesData[i];
        temp.xAxis = temp.dateTime.substr(0, 4);
        validTimeSeries.push(temp);
      }
      returnObject.timeSeriesData = validTimeSeries.reverse();

      res.status(response.status).json(returnObject);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets a list of the top trending stock symbols.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTrending(req, res) {
  const url = `${process.env.FMP_DOMAIN}/api/v3/stock/gainers?apikey=${process.env.FMP_API_KEY}`;

  axios.get(url).then((response) => {
    res.status(response.status).json(response.data);
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Uses the analyst price target as a prediction for the stock price in 12 months
 * for the symbol passed as the path param. Optional query param 'days' to
 * calculate the predicted price for x days in the future.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function predictPrice(req, res) {
  const { symbol } = req.params;

  const url = `${process.env.AV_DOMAIN}/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.AV_API_KEY}`;

  axios.get(url).then((response) => {
    // AV API returns empty object if stock symbol is invalid
    if (!Object.keys(response.data).length) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      const days = parseInt(req.query.days, 10);
      const currentPrice = parseFloat(response.data.MarketCapitalization) / parseFloat(response.data.SharesOutstanding);
      let prediction = response.data.AnalystTargetPrice;

      if (days >= 0) {
        prediction = currentPrice + (prediction - currentPrice) * days / 365;
      }

      const predictionObject = { prediction: Math.round(prediction * 100) / 100 };
      res.status(response.status).json(predictionObject);
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Gets a list of matching symbols for a search query.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function searchStocks(req, res) {
  const { keyword } = req.query;

  // use YAHOO FINANCE API for non-rate-limited searching
  let url = `${process.env.YAHOO_DOMAIN}/v1/finance/search`;
  url += `?q=${keyword}`;
  url += '&lang=en-US';
  url += '&region=US';
  url += '&quotesCount=10';
  url += '&newsCount=0';
  url += '&quotesQueryId=tss_match_phrase_query';
  url += '&multiQuoteQueryId=multi_quote_single_token_query';

  axios.get(url).then((response) => {
    const matches = [];
    response.data.quotes.forEach((el) => {
      // only include equities listed on US exchanges to keep consistent with AV API data
      if (el.isYahooFinance && el.quoteType === 'EQUITY' && el.exchange !== 'PNK' && !el.symbol.includes('.')) {
        const data = {
          symbol: el.symbol,
          name: el.longname,
        };
        matches.push(data);
      }
    });

    res.status(response.status).json({ matches });
  }).catch((err) => {
    res.status(err.response.status).json(err.response.data);
  });
}

module.exports = {
  getStockOverview,
  getTimeSeriesIntraday,
  getTimeSeriesDaily,
  getTimeSeriesWeekly,
  getTimeSeriesMonthly,
  getTimeSeriesYearly,
  getTrending,
  predictPrice,
  searchStocks,
};
