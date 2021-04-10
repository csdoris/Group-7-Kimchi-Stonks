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
async function addStock(stockSymbol, sharesBought, price, owner) {

  //retrieve user information
  const user = await User.findById(owner).populate('stocks');
  if(user === undefined){
    return { status: 400, json: { message: 'User could not be found' } };
  }
  const userStocks = user._doc.stocks;

  // If the user doesn't have enough funds to buy the stock, their purchase is terminated
  const buyingPowerLeft = user._doc.buyingPower - (sharesBought * price);
  if(buyingPowerLeft < 0){
    return { status: 400, json: { message: 'purchase exceeds buying power' } };
  }
  
  // For each of the stocks the user currently has, if the stock already exists, add onto that.
  for(index in userStocks){

    const stock = userStocks[index];

    if(stock.stockSymbol === stockSymbol){

      const currentShareHoldings = stock.totalShares;
      const avgPriceOfHoldings = stock.averagePrice;

      const stockBought = await addOntoStock(stockSymbol, currentShareHoldings, sharesBought, avgPriceOfHoldings, price, owner, buyingPowerLeft);
      if (stock) {
        return {
          status: 201,
          json: { stock_purchase: stockBought },
        };
      }

      return { status: 400, json: { message: 'could not finish purchase' } };
    }
  }

  // If the user has not bought the stock, create a new stock to the user's id as the owner
  // and associate the stock to the user's stock purchases
  const newStockInfo = await createNewStock(stockSymbol, sharesBought, price, owner, buyingPowerLeft);

  if(newStockInfo){
    return {
      status: 201,
      json: { stock_purchase: { newStockInfo } },
    };
  }
  
  return { status: 400, json: { message: 'could not finish purchase' } };

}

async function sellStock(stockSymbol, sellingAmount, price, owner){

  const sellingPrice = sellingAmount * price;
  const user = await User.findById(owner).populate('stocks');
  if(user === undefined){
    return { status: 400, json: { message: 'User could not be found' } };
  }
  const userStocks = user._doc.stocks;

  for(index in userStocks){

    const stock = userStocks[index];

    if(stock.stockSymbol === stockSymbol){

      if(stock.totalShares < sellingAmount){
        return { status: 400, json: { message: 'cannot sell more units than currently purchased' } };
      }
      console.log(stock.totalShares);
      console.log(sellingAmount);
      if(parseInt(stock.totalShares) === parseInt(sellingAmount)){
        await Stock.findOneAndDelete({stockSymbol: stockSymbol, owner: owner});
        await User.findByIdAndUpdate({_id: owner}, {$pull: {stocks: stock._id}, $inc: {buyingPower: sellingPrice}});
        return { status: 200, json: { message: 'successful sell' } };
      }
      
      await Stock.findOneAndUpdate({stockSymbol: stockSymbol, owner: owner},{ $set: {totalShares: (parseInt(stock.totalShares) - parseInt(sellingAmount))}});
      await User.findByIdAndUpdate({_id: owner}, {$inc: {buyingPower: sellingPrice}});
      return { status: 200, json: { message: 'successful sell' } };
    }
  }
  return { status: 400, json: { message: 'could not find stock' } };
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
  //const user =  await User.findByIdAndUpdate(id, {$inc : {buyingPower: amount}}, {returnOriginal : false});
  const user = await User.findOneAndUpdate({_id: id}, {$inc : {buyingPower: amount}}, {returnOriginal : false} );
  
  if(user){
    const userInfo = user._doc;
    return {
      status: 200,
      json: { user:  userInfo },
    };
  }

  return { status: 400, json: { message: 'User does not exist' } };
}

//only need symbol
async function createNewStock(stockSymbol, totalShares, averagePrice, owner, buyingPowerLeft){

  const newStock = new Stock({stockSymbol, totalShares, averagePrice, owner});
  const { err } = await newStock.save();
  if (err) {
    return undefined;
  }
  
  const newStockInfo = newStock._doc;
  await User.findByIdAndUpdate({_id: owner}, {$push: {stocks: newStockInfo._id}, $set: {buyingPower: buyingPowerLeft}});
  return newStockInfo;
}

async function addOntoStock(stockSymbol, currentShareHoldings, sharesBought, avgPriceOfHoldings, price, owner, buyingPowerLeft){
  const stock = await Stock
      .findOneAndUpdate({ stockSymbol: stockSymbol, owner: owner}, 
    {$inc : {totalShares: sharesBought}, 
    $set : {averagePrice: calculateAveragePrice(currentShareHoldings, avgPriceOfHoldings, sharesBought, price)}
  }, 
    {returnOriginal : false});

    await User.findByIdAndUpdate({_id: owner}, { $set: {buyingPower: buyingPowerLeft}});

    return stock;
}

module.exports = { addStock, sellStock, retrieveUserInformation, updateUserBuyingPower };
