const mongoose = require('mongoose');

const { Schema } = mongoose;

const stockSchema = Schema({
  symbol: {
    type: String,
    required: true,
  },
  shares: {
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
