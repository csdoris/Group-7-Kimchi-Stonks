const mongoose = require('mongoose');

let db;

/**
 * Connects to the MongoDB cluster
 */
function connect() {
  mongoose.connect(
    process.env.MONGO_DB_URI,
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
