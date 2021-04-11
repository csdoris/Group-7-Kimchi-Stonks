const Stock = require('../mongodb/schemas/stockSchema');
const User = require('../mongodb/schemas/userSchema');


/**
 * The calculateAveragePrice function calculates the average price of each unit of stock/share
 * the user has purchased.
 * This is called whenever the user buys the same stock on top of the purchases they already have.
 * The average is calculated by finding out the total price every unit the user has in possession
 * and dividing that by how many units the user has.
 * @param {*} currentShares The current total number of shares the user has in possession
 * @param {*} averagePrice The average price of each share/unit that the user possesses before buying more.
 * @param {*} additionalShares The number of shares/units the user is trying to buy
 * @param {*} currentPrice The price of each share/unit that the user is trying to buy.
 * @returns The average price of shares that the user owns after purchasing the shares/units.
 */
function calculateAveragePrice(currentShares, averagePrice, additionalShares, currentPrice) {
  return ((currentShares * averagePrice)
  + (additionalShares * currentPrice))
  / (parseInt(currentShares, 10) + parseInt(additionalShares, 10));
}

/**
 * The createNewStock function creates a new stock purchase into the mongoDB and also creates a refernce
 * of the stock into the user's "stock" field. This function also sets the updated buying power that
 * they user has after purchasing the stock into the user entry.
 * This is called if the user is trying to buy a stock that they have not currently have shares of.
 * @param {*} stockSymbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} totalShares The total number of shares the user to buying
 * @param {*} averagePrice The average price of each unit bought
 * @param {*} owner The user's ID
 * @param {*} buyingPowerLeft The amount of buying power the user has left
 * @returns 
 */
async function createNewStock(stockSymbol, totalShares, averagePrice, owner, buyingPowerLeft) {
  
  const newStock = new Stock({
    stockSymbol, totalShares, averagePrice, owner,
  });
  
  const { err } = await newStock.save();
  
  if (err) {
    return undefined;
  }

  const newStockInfo = newStock._doc;
  
  await User.findByIdAndUpdate({ _id: owner },
    {
      $push: { stocks: newStockInfo._id },
      $set: { buyingPower: buyingPowerLeft },
    });
  
    return newStockInfo;
}

/**
 * The addOntoStock function adds more units onto stocks that the user has already bought.
 * This is called if the user purchases a stock which they have already invested in.
 * This function also calls upon the calculateAveragePrice function in order to calculate the new
 * average price
 * @param {*} stockSymbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} currentShareHoldings The amount of shares/units the user currently holds
 * @param {*} sharesBought The number of shares/units bought by the user
 * @param {*} avgPriceOfHoldings The average price of each unit which the user is holding prior to purchase
 * @param {*} price The price of each share/unit the user buys at
 * @param {*} owner The user's ID
 * @param {*} buyingPowerLeft The amount of buying power the user has left after the purchase
 * @returns 
 */
async function addOntoStock(stockSymbol, currentShareHoldings, sharesBought,
  avgPriceOfHoldings, price, owner, buyingPowerLeft) {
  const stock = await Stock
    .findOneAndUpdate({ stockSymbol, owner },
      {
        $inc: { totalShares: sharesBought },
        $set: {
          averagePrice: calculateAveragePrice(
            currentShareHoldings, avgPriceOfHoldings, sharesBought, price,
          ),
        },
      },
      { returnOriginal: false });

  await User.findByIdAndUpdate({ _id: owner }, { $set: { buyingPower: buyingPowerLeft } });

  return stock;
}

/**
 * The sellAllStock sells all the shares the user has for a specific stock.
 * This is done by retrieving all the profits the user would make as well as
 * deleting all entries within the database related to that stock.
 * @param {*} stock The stock which the user is selling
 * @param {*} sellingPrice The price of each unit/share the user is selling
 */
async function sellAllStock(stock, sellingPrice) {
  await Stock.findOneAndDelete({ stockSymbol: stock.stockSymbol, owner: stock.owner });
  await User.findByIdAndUpdate({ _id: stock.owner },
    { $pull: { stocks: stock._id }, $inc: { buyingPower: sellingPrice } });
}


/**
 * The sellPartialStock function sells a partial amount of a specifc stock the user owns.
 * This is done by changing the amount of shares/units the user is holding and updating
 * the user's buying power by increasing it by the profits.
 * @param {*} stock The stock the user is selling
 * @param {*} sellingAmount The number of shares the user is selling
 * @param {*} sellingPrice The price of each unit/share the user is selling
 */
async function sellPartialStock(stock, sellingAmount, sellingPrice) {
  await Stock.findOneAndUpdate({ stockSymbol: stock.stockSymbol, owner: stock.owner },
    { $set: { totalShares: (parseInt(stock.totalShares, 10) - parseInt(sellingAmount, 10)) } });
  await User.findByIdAndUpdate({ _id: stock.owner }, { $inc: { buyingPower: sellingPrice } });
}

/**
 * The buyStock is the main function called upon for a user to buy stocks.
 * This function check whether the user has enough buying power in order to make
 * the purchase happen, and then goes ahead and does it by either creating a new stock
 * entry or by adding onto an existing stock entry (given the user has previously bought it).
 * @param {*} stockSymbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} sharesBought The number of shares/units bought by the user
 * @param {*} price The price of each share/unit which the user bought
 * @param {*} owner The user's ID
 * @returns A status 201 with the stock purchased as json within the body if the purchase was successful.
 *          A status 400 with a relevant error message if the purchase was unsuccessful.
 */
async function buyStock(stockSymbol, sharesBought, price, owner) {
  // retrieve user information
  const user = await User.findById(owner).populate('stocks');
  if (user === undefined) {
    return { status: 400, json: { message: 'User could not be found' } };
  }
  const userStocks = user._doc.stocks;

  // If the user doesn't have enough funds to buy the stock, their purchase is terminated
  const buyingPowerLeft = user._doc.buyingPower - (sharesBought * price);
  if (buyingPowerLeft < 0) {
    return { status: 400, json: { message: 'purchase exceeds buying power' } };
  }
  const stock = userStocks.find((stocks) => stocks.stockSymbol === stockSymbol);

  if (stock) {
    const stockBought = await
    addOntoStock(stockSymbol, stock.totalShares, sharesBought,
      stock.averagePrice, price, owner, buyingPowerLeft);
    if (stockBought) {
      return {
        status: 201,
        json: { stock_purchase: stockBought },
      };
    }

    return { status: 400, json: { message: 'could not finish purchase' } };
  }
  const newStockInfo = await
  createNewStock(stockSymbol, sharesBought, price, owner, buyingPowerLeft);

  if (newStockInfo) {
    return {
      status: 201,
      json: { stock_purchase: { newStockInfo } },
    };
  }
  return { status: 400, json: { message: 'could not finish purchase' } };
}

/**
 * The sellStock function is the main function called upon for a user to sell their stocks.
 * This function checks whether the user has/ has enough of the stock they want to sell. and then
 * goes ahead and either sells a portion of their stock or sells all shares/units which the user owns.
 * @param {*} stockSymbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} sellingAmount The number of units/shares the user is selling
 * @param {*} price The price of each share/unit which the user bought
 * @param {*} owner The user's ID
 * @returns A status 201 with a relevant message if the purchase was successful.
 *          A status 400 with a relevant error message if the purchase was unsuccessful.
 */
async function sellStock(stockSymbol, sellingAmount, price, owner) {
  const sellingPrice = sellingAmount * price;
  const user = await User.findById(owner).populate('stocks');
  if (user === undefined) {
    return { status: 400, json: { message: 'User could not be found' } };
  }
  const userStocks = user._doc.stocks;

  const stock = userStocks.find((stocks) => stocks.stockSymbol === stockSymbol);

  if (stock === undefined) {
    return { status: 400, json: { message: 'could not find stock' } };
  }
  if (stock.totalShares < sellingAmount) {
    return { status: 400, json: { message: 'cannot sell more units than currently purchased' } };
  }
  if (parseInt(stock.totalShares, 10) === parseInt(sellingAmount, 10)) {
    await sellAllStock(stock, sellingPrice);
    return { status: 200, json: { message: 'successful sell' } };
  }
  await sellPartialStock(stock, sellingAmount, sellingPrice);
  return { status: 200, json: { message: 'successful sell' } };
}

/**
 * Retrieves the user information as well as all the stocks the user has currently purchased
 * @param {*} id The user's ID
 * @returns A status 201 with the user's information in json if successful.
 *          A status 400 with an error message if successful.
 */
async function retrieveUserInformation(id) {
  const user = await User.findById(id);

  if (user) {
    const userInfo = user._doc;
    const stock = await Stock.find({ owner: id });
    return {
      status: 200,
      json: { user: { ...userInfo }, stocks: stock },
    };
  }

  return { status: 400, json: { message: 'User does not exist' } };
}

/**
 * The uodateUserBuyingPower adds more buying power to a user.
 * This function does not allow buying power to be reduced.
 * @param {*} id The ID of the user
 * @param {*} amount The amoount of increase in buying power
 * @returns A status 200 and the user information in the form of json if successful.
 *          A status 400 and a relevant error message if unsuccessful.
 */
async function updateUserBuyingPower(id, amount) {
  if (amount < 0) {
    return { status: 400, json: { message: 'cannot add negative values' } };
  }

  const user = await User.findOneAndUpdate({ _id: id },
    { $inc: { buyingPower: amount } }, { returnOriginal: false });

  if (user) {
    const userInfo = user._doc;
    return {
      status: 200,
      json: { user: userInfo },
    };
  }

  return { status: 400, json: { message: 'User does not exist' } };
}

// only need symbol

module.exports = {
  buyStock, sellStock, retrieveUserInformation, updateUserBuyingPower,
};
