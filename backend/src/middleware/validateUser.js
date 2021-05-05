const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret';

/**
 * Extracts the token from the authorization request header and verifies whether
 * the token is valid or not.
 *
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
function validateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = { id: decodedToken.id, token };
    next();
  } catch (error) {
    res.status(401).json(undefined);
  }
}

module.exports = validateUser;
