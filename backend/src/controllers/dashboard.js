const axios = require('axios');

/**
 * Gets the stock data for the stock ticker passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getStockData(req, res) {
  res.status(status).json(json);
}

/**
 * Gets a list of the top 10 trending stock tickers.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getTrending(req, res) {
    const url = 'https://financialmodelingprep.com/api/v3/stock/gainers?apikey=' + process.env.FMP_API_KEY
    axios.get(url).then(resp => {
        res.status(200).json(resp.data);
    });
}

/**
 * Calculates a price prediction for the stock ticker passed as the path param.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function predictPrice(req, res) {
  res.status(status).json(json);
}

module.exports = { getStockData, getTrending, predictPrice };
