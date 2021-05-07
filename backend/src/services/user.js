const axios = require('axios');
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

function calculateStockPriceChange(priceBoughtAt, marketPrice) {
  const priceDifferencePercentage = ((((((marketPrice - priceBoughtAt) / priceBoughtAt) * 100) + Number.EPSILON) * 100) / 100).toFixed(2);
  const priceDifferenceValue = (((marketPrice - priceBoughtAt + Number.EPSILON) * 100) / 100).toFixed(2);
  if (priceDifferenceValue < 0) {
    return `${priceDifferenceValue} (${priceDifferencePercentage}%)`;
  }
  return `+${priceDifferenceValue} (+${priceDifferencePercentage}%)`;
}

/**
 * The createNewStock function creates a new stock purchase into the mongoDB and also creates a
 * refernce of the stock into the user's "stock" field. This function also sets the updated
 * buying power that they user has after purchasing the stock into the user entry.
 * This is called if the user is trying to buy a stock that they have not currently have shares of.
 * @param {*} symbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} shares The total number of shares the user to buying
 * @param {*} stockPrice The average price of each unit bought
 * @param {*} owner The user's ID
 * @param {*} buyingPowerLeft The amount of buying power the user has left
 * @returns
 */
async function createNewStock(symbol, shares, stockPrice, owner, buyingPowerLeft) {
  const newStock = new Stock({
    symbol, shares, averagePrice: stockPrice, owner,
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

async function updateUserEquity(id) {
  let user = await User.findById(id).populate('stocks');
  const { stocks } = user._doc;
  let calculatedEquity = 0;
  const stockPrices = [];

  for (let i = 0; i < stocks.length; i += 1) {
    const { symbol } = stocks[i];
    let url = `${process.env.WSJ_DOMAIN}/market-data/quotes/${symbol}`;
    url += `?id={"ticker":"${symbol}","countryCode":"US","exchange":"","type":"STOCK","path":"/${symbol}"}`;
    url += '&type=quotes_chart';
    const response = axios.get(url);
    stockPrices.push(response);
  }
  const finishedStockPrices = await Promise.all(stockPrices);

  for (let i = 0; i < finishedStockPrices.length; i += 1) {
    const currentStock = stocks.find((userStocks) => userStocks.symbol === finishedStockPrices[i].data.data.quote.Instrument.Ticker);
    calculatedEquity += finishedStockPrices[i].data.data.quote.topSection.value.replace(',', '') * currentStock.shares;
  }

  user = await User.findByIdAndUpdate({ _id: id }, { $set: { totalEquity: calculatedEquity } }, { returnOriginal: false });

  if (user._doc.stocks.length > 0) {
    await User.populate(user, 'stocks');
  }

  const { password, ...userInfo } = user._doc;
  return userInfo;
}

async function updateUserStockStatistics(id) {
  const user = await User.findById(id).populate('stocks');
  const { stocks } = user._doc;
  const stockPrices = [];

  for (let i = 0; i < stocks.length; i += 1) {
    const { symbol } = stocks[i];
    let url = `${process.env.WSJ_DOMAIN}/market-data/quotes/${symbol}`;
    url += `?id={"ticker":"${symbol}","countryCode":"US","exchange":"","type":"STOCK","path":"/${symbol}"}`;
    url += '&type=quotes_chart';
    const response = axios.get(url);
    stockPrices.push(response);
  }
  const finishedStockPrices = await Promise.all(stockPrices);
  const stockUpdates = [];

  for (let i = 0; i < finishedStockPrices.length; i += 1) {
    const currentStock = stocks.find((userStocks) => userStocks.symbol === finishedStockPrices[i].data.data.quote.Instrument.Ticker);
    const stock = Stock
      .findOneAndUpdate({ symbol: currentStock.symbol, owner: id },
        {
          $set: {
            totalChange: calculateStockPriceChange(currentStock.averagePrice, finishedStockPrices[i].data.data.quote.topSection.value.replace(',', '')),
          },
        },
        { returnOriginal: false });
    stockUpdates.push(stock);
  }

  await Promise.all(stockUpdates);
}
/**
 * The addOntoStock function adds more units onto stocks that the user has already bought.
 * This is called if the user purchases a stock which they have already invested in.
 * This function also calls upon the calculateAveragePrice function in order to calculate the new
 * average price
 * @param {*} symbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} currentShareHoldings The amount of shares/units the user currently holds
 * @param {*} shares The number of shares/units bought by the user
 * @param {*} avgPriceOfHoldings The average price of each unit which the user is holding prior to purchase
 * @param {*} stockPrice The price of each share/unit the user buys at
 * @param {*} owner The user's ID
 * @param {*} buyingPowerLeft The amount of buying power the user has left after the purchase
 * @returns
 */
async function addOntoStock(symbol, currentShareHoldings, shares,
  avgPriceOfHoldings, stockPrice, owner, buyingPowerLeft) {
  const stock = await Stock
    .findOneAndUpdate({ symbol, owner },
      {
        $inc: { shares },
        $set: {
          averagePrice: calculateAveragePrice(
            currentShareHoldings, avgPriceOfHoldings, shares, stockPrice,
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
  await Stock.findOneAndDelete({ symbol: stock.symbol, owner: stock.owner });
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
  await Stock.findOneAndUpdate({ symbol: stock.symbol, owner: stock.owner },
    { $set: { shares: (stock.shares - sellingAmount) } });
  await User.findByIdAndUpdate({ _id: stock.owner }, { $inc: { buyingPower: sellingPrice } });
}

/**
 * The buyStock is the main function called upon for a user to buy stocks.
 * This function check whether the user has enough buying power in order to make
 * the purchase happen, and then goes ahead and does it by either creating a new stock
 * entry or by adding onto an existing stock entry (given the user has previously bought it).
 * @param {*} symbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} shares The number of shares/units bought by the user
 * @param {*} stockPrice The price of each share/unit which the user bought
 * @param {*} owner The user's ID
 * @returns A status 201 with the stock purchased as json within the body
 *          if the purchase was successful.
 *          A status 400 with a relevant error message if the purchase was unsuccessful.
 */
async function buyStock(symbol, shares, stockPrice, totalSpent, owner) {
  // retrieve user information
  const user = await User.findById(owner).populate('stocks');
  if (user === undefined) {
    return { status: 400, json: { message: 'User could not be found.' } };
  }
  const userStocks = user._doc.stocks;

  // If the user doesn't have enough funds to buy the stock, their purchase is terminated
  const buyingPowerLeft = user._doc.buyingPower - totalSpent;
  if (buyingPowerLeft < 0) {
    return { status: 400, json: { message: 'Purchase exceeds buying power.' } };
  }
  const stock = userStocks.find((stocks) => stocks.symbol === symbol);

  if (stock) {
    const stockBought = await addOntoStock(symbol, stock.shares, shares,
      stock.averagePrice, stockPrice, owner, buyingPowerLeft);
    if (stockBought) {
      await updateUserStockStatistics(owner);
      const userInfo = await updateUserEquity(owner);
      return {
        status: 200,
        json: { user: userInfo },
      };
    }

    return { status: 400, json: { message: 'Could not finish purchase.' } };
  }

  const newStockInfo = await createNewStock(symbol, shares, stockPrice, owner, buyingPowerLeft);

  if (newStockInfo) {
    await updateUserStockStatistics(owner);
    const userInfo = await updateUserEquity(owner);
    return {
      status: 200,
      json: { user: userInfo },
    };
  }
  return { status: 400, json: { message: 'Could not finish purchase.' } };
}

/**
 * The sellStock function is the main function called upon for a user to sell their stocks.
 * This function checks whether the user has/ has enough of the stock they want to sell. and then
 * goes ahead and either sells a portion of their stock or sells all shares/units which the
 * user owns.
 * @param {*} symbol The unique identifying symbol for the stock the user is purchasing
 * @param {*} sellingAmount The number of units/shares the user is selling
 * @param {*} stockPrice The price of each share/unit which the user bought
 * @param {*} owner The user's ID
 * @returns A status 201 with a relevant message if the purchase was successful.
 *          A status 400 with a relevant error message if the purchase was unsuccessful.
 */
async function sellStock(symbol, sellingAmount, stockPrice, owner) {
  const sellingPrice = sellingAmount * stockPrice;
  const user = await User.findById(owner).populate('stocks');
  if (user === undefined) {
    return { status: 400, json: { message: 'User could not be found' } };
  }
  const userStocks = user._doc.stocks;

  const stock = userStocks.find((stocks) => stocks.symbol === symbol);

  if (stock === undefined) {
    return { status: 400, json: { message: 'could not find stock' } };
  }
  if (stock.shares < sellingAmount) {
    return { status: 400, json: { message: 'cannot sell more units than currently purchased' } };
  }
  if (stock.shares === sellingAmount) {
    await sellAllStock(stock, sellingPrice);
    await updateUserStockStatistics(owner);
    const userInfo = await updateUserEquity(owner);
    return { status: 200, json: { message: 'successful sell', user: userInfo } };
  }
  await sellPartialStock(stock, sellingAmount, sellingPrice);
  await updateUserStockStatistics(owner);
  const userInfo = await updateUserEquity(owner);
  return { status: 200, json: { message: 'successful sell', user: userInfo } };
}

/**
 * Retrieves the user information as well as all the stocks the user has currently purchased
 * @param {*} id The user's ID
 * @returns A status 201 with the user's information in json if successful.
 *          A status 400 with an error message if successful.
 */
async function retrieveUserInformation(id) {
  await updateUserStockStatistics(id);
  const user = await User.findById(id);

  if (user) {
    await User.populate(user, 'stocks');
    const userInfo = await updateUserEquity(id);
    return {
      status: 200,
      json: { user: userInfo },
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
  await updateUserStockStatistics(id);
  const user = await User.findOneAndUpdate({ _id: id },
    { $inc: { buyingPower: amount } }, { returnOriginal: false });

  if (user) {
    await User.populate(user, 'stocks');
    const userInfo = await updateUserEquity(id);
    return {
      status: 200,
      json: { user: userInfo },
    };
  }

  return { status: 400, json: { message: 'User does not exist' } };
}

module.exports = {
  buyStock, sellStock, retrieveUserInformation, updateUserBuyingPower,
};
