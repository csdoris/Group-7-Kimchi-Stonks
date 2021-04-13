const axios = require('axios');

/**
 * Gets the stock overview for the stock symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getStockOverview(req, res) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${req.params.id}&apikey=${process.env.AV_API_KEY}`;
  axios.get(url).then((resp) => {
    res.status(resp.status).json(resp.data);
  }).catch((err) => {
    res.status(err.response.status).json(err.response.data);
  });
}

/**
 * Gets the intraday (5 min resolution) stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesIntraday(req, res) {
  res.json(req);
}

/**
 * Gets the daily stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesDaily(req, res) {
  res.json(req);
}

/**
 * Gets the weekly stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesWeekly(req, res) {
  res.json(req);
}

/**
 * Gets the monthly stock time series for the symbol passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTimeSeriesMonthly(req, res) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${req.params.id}&apikey=${process.env.AV_API_KEY}`;
  axios.get(url).then((response) => {
    res.status(response.status).json(response.data);
  }).catch((err) => {
    res.status(err.response.status).json(err.response.data);
  });
}

/**
 * Gets a list of the top trending stock symbols.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTrending(req, res) {
  const url = `https://financialmodelingprep.com/api/v3/stock/gainers?apikey=${process.env.FMP_API_KEY}`;
  axios.get(url).then((response) => {
    res.status(response.status).json(response.data);
  }).catch((err) => {
    res.status(err.response.status).json(err.response.data);
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
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${req.params.id}&apikey=${process.env.AV_API_KEY}`;
  axios.get(url).then((response) => {
    const days = parseInt(req.query.days, 10);
    const currentPrice = parseFloat(response.data.MarketCapitalization) / parseFloat(response.data.SharesOutstanding);
    let prediction = response.data.AnalystTargetPrice;

    if (days >= 0) {
      prediction = currentPrice + (prediction - currentPrice) * days / 365;
    }

    const predictionJSON = { prediction: Math.round(prediction * 100) / 100 };
    res.status(response.status).json(predictionJSON);
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
  getTrending,
  predictPrice,
};
