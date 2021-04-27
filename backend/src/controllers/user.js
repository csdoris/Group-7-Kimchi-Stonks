const userService = require('../services/user');

/**
 * Retireves the user's information from the database.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function getUserInformation(req, res) {
  const { id } = req.user;

  const { status, json } = await userService.retrieveUserInformation(id);

  res.status(status).json(json);
}

/**
 * Updates user's buying power with the requested amount.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function addBuyingPower(req, res) {
  const { id } = req.user;
  const { amount } = req.body;

  const { status, json } = await userService.updateUserBuyingPower(id, amount);

  res.status(status).json(json);
}

/**
 * Updates user's stock holdings by adding specified stock amount.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function buyStock(req, res) {
  const { id } = req.user;
  const {
    symbol, shares, stockPrice, totalSpent,
  } = req.body;

  const { status, json } = await userService
    .buyStock(symbol, shares, stockPrice, totalSpent, id);

  res.status(status).json(json);
}

/**
 * Updates user's stock holdings by removing specified stock amount.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function sellStock(req, res) {
  const { id } = req.user;
  const { symbol, sellingAmount, stockPrice } = req.body;

  const { status, json } = await userService
    .sellStock(symbol, sellingAmount, stockPrice, id);

  res.status(status).json(json);
}

module.exports = {
  getUserInformation, addBuyingPower, buyStock, sellStock,
};
