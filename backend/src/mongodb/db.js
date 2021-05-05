const mongoose = require('mongoose');

let db;
const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb+srv://dbUser:htCx5uzXmf0Nq3o5@kimchi-stonks.3xm5m.mongodb.net/kimchiStonks?retryWrites=true&w=majority';

/**
 * Connects to the MongoDB cluster
 */
function connect() {
  mongoose.connect(
    MONGO_DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err) => {
      if (err) throw err;

      console.log('Connection to MongoDB successful.');
    },
  );
}

/**
 * Returns the currently connect MongoDB cluster
 *
 * @return {Object}  MongoDB cluster
 */
function get() {
  return db;
}

/**
 * Closes the MongoDB cluster connection
 */
function close() {
  db.close();
}

module.exports = { connect, get, close };
