const AuthService = require('../services/auth');

/**
 * Extracts the request body and uses it to create a new user in the database.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function registerNewUser(req, res) {
  const {
    firstName, lastName, email, password,
  } = req.body;

  const { status, json } = await AuthService.createNewUser(firstName, lastName, email, password);

  res.status(status).json(json);
}

module.exports = { registerNewUser };
