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

/**
 * Extracts the request body and uses it to authenticate the user.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function loginUser(req, res) {
  const {
    email, password,
  } = req.body;

  const { status, json } = await AuthService.authenticateUser(email, password);

  res.status(status).json(json);
}

/**
 * Extracts the user ID and uses it to fetch the user data.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
async function autoLoginUser(req, res) {
  const { id, token } = req.user;

  const { status, json } = await AuthService.retrieveUser(id, token);

  res.status(status).json(json);
}

module.exports = { registerNewUser, loginUser, autoLoginUser };
