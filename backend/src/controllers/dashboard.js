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
  res.status(status).json(json);
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
