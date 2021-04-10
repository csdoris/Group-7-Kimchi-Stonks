const userService = require('../services/user');

async function buyStock(req, res) {
  const {
    stockSymbol, sharesBought, price,
  } = req.query;

  const { id } = req.query;

  const { status, json } = await userService
    .addStock(stockSymbol, sharesBought, price, id);

  res.status(status).json(json);
}

async function sellStock(req, res) {
  const {
    stockSymbol, sellingAmount, price
  } = req.query;

  const { id } = req.query;

  const { status, json } = await userService
    .sellStock(stockSymbol, sellingAmount, price, id);

  res.status(status).json(json);
}

async function getUserInformation(req, res) {
  const { id } = req.params;
  // const { id } = req.user;

  const { status, json } = await userService.retrieveUserInformation(id);

  res.status(status).json(json);
}

async function addCreditsToUser(req, res) {
  const { id } = req.params;
  const { amount } = req.query;

  const { status, json } = await userService.updateUserBuyingPower(id, amount);

  res.status(status).json(json);
}

module.exports = {
  buyStock, sellStock, getUserInformation, addCreditsToUser,
};
