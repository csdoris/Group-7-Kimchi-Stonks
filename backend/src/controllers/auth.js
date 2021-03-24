const AuthService = require('../services/auth');

async function registerNewUser(req, res) {
  const { firstName, lastName, email, password } = req.body;

  const { status, json } = await AuthService.createNewUser(firstName, lastName, email, password);

  res.status(status).json(json);
}

module.exports = { registerNewUser };
