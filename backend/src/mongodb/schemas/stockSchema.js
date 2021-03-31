const mongoose = require('mongoose');

const { Schema } = mongoose;

const stockSchema = Schema({
  stockName: {
    type: String,
    required: true,
  },
  stockSymbol: {
    type: String,
    required: true,
  },
  totalShares: {
    type: Number,
    required: true,
    default: 0,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
