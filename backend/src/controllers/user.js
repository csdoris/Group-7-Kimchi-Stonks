const userService = require('../services/user');

async function buyStock(req, res) {
  const {
    stockName, stockSymbol, currentShares, additionalShares, averagePrice, currentPrice,  owner,
  } = req.query;

  const { status, json } = await userService
    .addStock(stockName, stockSymbol, currentShares, additionalShares, averagePrice, currentPrice,  owner,);

  res.status(status).json(json);
}

async function getUserInformation(req, res){
  const { id } = req.params;
  
  const { status, json } = await userService.retrieveUserInformation(id);

  res.status(status).json(json);
}

async function addCreditsToUser(req, res){
  const { id } = req.params;
  const { amount } = req.query;

  const { status, json } = await userService.updateUserBuyingPower(id, amount);

  res.status(status).json(json);
}

module.exports = { buyStock, getUserInformation, addCreditsToUser};
