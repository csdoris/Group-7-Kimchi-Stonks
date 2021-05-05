const axios = require('axios');

const TIME_SERIES_INTRADAY = 0;
const TIME_SERIES_DAILY = 1;
const TIME_SERIES_MONTHLY = 2;
const TIME_SERIES_YEARLY = 3;

const FMP_API_KEY = process.env.FMP_API_KEY || '3ed6aa92d60ca415e41dd482fbee9ee7';
const FMP_DOMAIN = 'https://financialmodelingprep.com';
const YAHOO_DOMAIN = 'https://query2.finance.yahoo.com';
const WSJ_DOMAIN = 'https://www.wsj.com';

/**
 * Formats Unix epoch time to human-readable string: yyyy-mm-dd HH:mm
 *
 * @param {*} unixTime unix epoch time
 * @returns human-readable string representation of supplied Unix time: yyyy-mm-dd HH:mm
 */
function convertUnixTimeToEDT(unixTime) {
  const d = new Date(unixTime * 1000);
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const nd = new Date(utc - 14400000 - (d.getTimezoneOffset() * 60 * 1000));
  return `${nd.toISOString().substr(0, 10)} ${nd.toISOString().substr(11, 5)}`;
}

/**
 * Formats response from Yahoo Finance for output.
 *
 * @param  {Object} data     Yahoo Finance API repsonse data
 * @param  {Object} interval Data interval
 */
function formatReturnData(data, interval) {
  let intervalText;
  switch (interval) {
    case TIME_SERIES_INTRADAY:
      intervalText = '30min';
      break;
    case TIME_SERIES_DAILY:
      intervalText = 'Daily';
      break;
    case TIME_SERIES_MONTHLY:
      intervalText = 'Monthly';
      break;
    case TIME_SERIES_YEARLY:
      intervalText = 'Yearly';
      break;
    default:
  }

  const metaData = {
    symbol: data.chart.result[0].meta.symbol,
    interval: intervalText,
  };

  const timeSeriesData = [];

  const { timestamp } = data.chart.result[0];
  const {
    open, high, low, close, volume,
  } = data.chart.result[0].indicators.quote[0];

  for (let i = 0; i < timestamp.length; i += 1) {
    const dataPoint = {
      xAxis: '',
      open: Math.round(open[i] * 100) / 100,
      high: Math.round(high[i] * 100) / 100,
      low: Math.round(low[i] * 100) / 100,
      close: Math.round(close[i] * 100) / 100,
      volume: Math.round(volume[i] * 100) / 100,
    };

    switch (interval) {
      case TIME_SERIES_INTRADAY:
        dataPoint.xAxis = convertUnixTimeToEDT(timestamp[i]).substr(11, 5);
        break;
      case TIME_SERIES_DAILY:
        dataPoint.xAxis = new Date(convertUnixTimeToEDT(timestamp[i]).substr(0, 10)).toLocaleDateString('en-us', { weekday: 'long' }).substr(0, 3);
        break;
      case TIME_SERIES_MONTHLY:
        dataPoint.xAxis = new Date(convertUnixTimeToEDT(timestamp[i]).substr(0, 10)).toLocaleDateString('en-us', { month: 'long' }).substr(0, 3);
        break;
      case TIME_SERIES_YEARLY:
        dataPoint.xAxis = convertUnixTimeToEDT(timestamp[i]).substr(0, 4);
        break;
      default:
    }

    if (interval !== TIME_SERIES_YEARLY || i % 4 === 0) { // yearly: only add every 4th data point
      timeSeriesData.push(dataPoint);
    }
  }

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
  const symbol = req.params.symbol.replace('-', '.');

  let url = `${WSJ_DOMAIN}/market-data/quotes/${symbol}`;
  url += `?id={"ticker":"${symbol}","countryCode":"US","exchange":"","type":"STOCK","path":"/${symbol}"}`;
  url += '&type=quotes_chart';

  axios.get(encodeURI(url)).then((response) => {
    const lowHigh = response.data.data.quote.F2Week.LowHighVal;

    const returnObject = {
      symbol: response.data.data.quote.Instrument.Ticker,
      name: response.data.data.quote.Instrument.CommonName,
      currentPrice: response.data.data.quote.topSection.value.replace(',', ''),
      yearLow: lowHigh.split(' - ')[0].replace(',', ''),
      yearHigh: lowHigh.split(' - ')[1].replace(',', ''),
      volume: response.data.data.quote.Todays.Vol,
      marketCap: response.data.data.quote.marketCap,
    };

    res.status(response.status).json(returnObject);
  }).catch((err) => {
    if (err.message.includes('404')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(500).json(err);
    }
  });
}

/**
 * Gets the intraday (30 min resolution, 09:30-15:30) stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesIntraday(req, res) {
  const { symbol } = req.params;

  const url = `${YAHOO_DOMAIN}/v8/finance/chart/${symbol}?region=US&lang=en-US&interval=30m&range=1d`;

  axios.get(url).then((response) => {
    const returnObject = formatReturnData(response.data, TIME_SERIES_INTRADAY);
    res.status(response.status).json(returnObject);
  }).catch((err) => {
    if (err.message.includes('404')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(500).json(err);
    }
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

  const url = `${YAHOO_DOMAIN}/v8/finance/chart/${symbol}?region=US&lang=en-US&interval=1d&range=5d`;

  axios.get(url).then((response) => {
    const returnObject = formatReturnData(response.data, TIME_SERIES_DAILY);
    res.status(response.status).json(returnObject);
  }).catch((err) => {
    if (err.message.includes('404')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(500).json(err);
    }
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

  const url = `${YAHOO_DOMAIN}/v8/finance/chart/${symbol}?region=US&lang=en-US&interval=1mo&range=1y`;

  axios.get(url).then((response) => {
    const returnObject = formatReturnData(response.data, TIME_SERIES_MONTHLY);

    // api returns most recent month twice, need to trim data
    if (returnObject.timeSeriesData.length > 12) {
      returnObject.timeSeriesData = returnObject.timeSeriesData.slice(0, 12);
    }

    res.status(response.status).json(returnObject);
  }).catch((err) => {
    if (err.message.includes('404')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(500).json(err);
    }
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

  const url = `${YAHOO_DOMAIN}/v8/finance/chart/${symbol}?region=US&lang=en-US&interval=3mo&range=10y`;

  axios.get(url).then((response) => {
    const returnObject = formatReturnData(response.data, TIME_SERIES_YEARLY);
    res.status(response.status).json(returnObject);
  }).catch((err) => {
    if (err.message.includes('404')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(500).json(err);
    }
  });
}

/**
 * Gets a list of the top trending stock symbols.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTrending(req, res) {
  const url = `${FMP_DOMAIN}/api/v3/stock/gainers?apikey=${FMP_API_KEY}`;

  axios.get(url).then((response) => {
    res.status(response.status).json(response.data);
  }).catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * Use an arbitrary multiplier (!) as a prediction for the stock price in 12 months
 * for the symbol passed as the path param. Optional query param 'days' to
 * calculate the predicted price for x days in the future.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function predictPrice(req, res) {
  const symbol = req.params.symbol.replace('-', '.');
  const days = parseInt(req.query.days, 10);

  let url = `${WSJ_DOMAIN}/market-data/quotes/${symbol}`;
  url += `?id={"ticker":"${symbol}","countryCode":"US","exchange":"","type":"STOCK","path":"/${symbol}"}`;
  url += '&type=quotes_chart';

  axios.get(encodeURI(url)).then((response) => {
    const currentPrice = parseFloat(response.data.data.quote.topSection.value.replace(',', ''));

    // arbitrary multiplier dependent on current hour to calculate prediction
    const hour = new Date().getHours();
    const multiplier = 1 + (12 - hour) / 100;
    let prediction = currentPrice * multiplier;
    if (days >= 0) {
      prediction = currentPrice + (prediction - currentPrice) * days / 365;
    }

    const predictionObject = { prediction: Math.round(prediction * 100) / 100 };
    res.status(response.status).json(predictionObject);
  }).catch((err) => {
    if (err.message.includes('404')) {
      res.status(404).json({ error: `${symbol.toUpperCase()} is not a valid stock symbol` });
    } else {
      res.status(500).json(err);
    }
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

  let url = `${YAHOO_DOMAIN}/v1/finance/search`;
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
      // only include equities listed on US exchanges to keep consistent with WSJ API data
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
    res.status(500).json(err);
  });
}

module.exports = {
  getStockOverview,
  getTimeSeriesIntraday,
  getTimeSeriesDaily,
  getTimeSeriesMonthly,
  getTimeSeriesYearly,
  getTrending,
  predictPrice,
  searchStocks,
};
