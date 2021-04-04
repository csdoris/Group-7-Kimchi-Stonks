const Stock = require('../mongodb/schemas/stockSchema');
const User = require('../mongodb/schemas/userSchema');


function calculateAveragePrice(currentShares, averagePrice, additionalShares, currentPrice){
  return ((currentShares * averagePrice) + 
  (additionalShares * currentPrice))/
  (parseInt(currentShares) + parseInt(additionalShares));
}
/**
 *
 * @param {*} stockName
 * @param {*} stockSymbol
 * @param {*} totalShares
 * @param {*} averagePrice
 * @param {*} owner
 * @returns
 */
async function addStock(stockName, stockSymbol, currentShares, additionalShares, averagePrice, currentPrice, owner) {

  const stock = await Stock
  .findOneAndUpdate({stockName: stockName, stockSymbol: stockSymbol, owner: owner}, 
    {$inc : {totalShares: additionalShares}, 
    $set : {averagePrice: calculateAveragePrice(currentShares, averagePrice, additionalShares, currentPrice)}
  }, 
    {returnOriginal : false});

  if (stock) {
    return {
      status: 201,
      json: { stock_purchase: stock },
    };
  }

  const newStock = new Stock({stockName, stockSymbol, totalShares: additionalShares, averagePrice: currentPrice, owner});

  const { err } = await newStock.save();

  if (err) {
    return { status: 400, json: { message: 'Error create new user.' } };
  }

  const newStockInfo = newStock._doc;

  return {
    status: 201,
    json: { stock_purchase: { ...newStockInfo } },
  };
  
}

async function retrieveUserInformation(id){
  const user = await User.findById(id);
  
  if(user){
    const userInfo = user._doc;
    const stock = await Stock.find({owner: id});
    return {
      status: 200,
      json: { user: { ...userInfo }, stocks: stock },
    };
  }

  return { status: 400, json: { message: 'User does not exist' } };
}

async function updateUserBuyingPower(id, amount){

  if(amount < 0){
    return { status: 400, json: { message: 'cannot add negative values' } };
  }

  const user = await User.findOneAndUpdate({_id: id}, {$inc : {buyingPower: amount}}, {returnOriginal : false} );
  
  if(user){
    const userInfo = user._doc;
    return {
      status: 200,
      json: { user: { ...userInfo }},
    };
  }

  return { status: 400, json: { message: 'User does not exist' } };
}

module.exports = { addStock, retrieveUserInformation, updateUserBuyingPower };
