const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../mongodb/schemas/userSchema');

/**
 * Generates an access token for the client
 *
 * @param  {String} id     User ID
 * @param  {number} number Access token duration in seconds
 * @return {Object}        A token object
 */
async function generateAccessToken(id, duration) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: duration });
}

/**
 * Checks if the user email already exists in the database
 *
 * @param  {String} email User's email
 * @return {Object}       Potentially a user
 */
async function isUserUnique(email) {
  return User.findOne({ email });
}

/**
 * Creates a new user using the user schema and persists it to the database.
 *
 * @param  {String} firstName User's first name
 * @param  {String} lastName  User's last name
 * @param  {String} email     User's email
 * @param  {String} password  User's password
 * @return {Object}           Object containing a status and json response property
 */
async function createNewUser(firstName, lastName, email, password) {
  const isValid = await isUserUnique(email);

  if (isValid) {
    return { status: 400, json: { message: 'Email is already being used.' } };
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Create new User from user schema
  const newUser = new User({
    firstName, lastName, email, password: hash,
  });

  // Persist user to the database
  const { err } = await newUser.save();

  if (err) {
    return { status: 400, json: { message: 'Error create new user.' } };
  }
  const newUserInfo = newUser._doc;
  const duration = 3600;
  const token = await generateAccessToken(newUser._id, duration);

  return {
    status: 201,
    json: { user: { ...newUserInfo, accessToken: { token, expiresIn: duration } } },
  };
}

/**
 * Authenticates a user using the supplied credentials and comparing it with
 * the database.
 *
 * @param  {String} email     User's email
 * @param  {String} password  User's password
 * @return {Object}           Object containing a status and json response property
 */
async function authenticateUser(email, password) {
  const user = await User.findOne({ email });

  if (user) {
    const isAuth = await bcrypt.compare(password, user.password);

    if (isAuth) {
      if (user._doc.stocks.length > 0) {
        await User.populate(user, 'stocks');
      }

      const { password: hashedPassword, ...userInfo } = user._doc;
      const duration = 3600;
      const token = await generateAccessToken(user._id, duration);

      return {
        status: 200,
        json: { user: { ...userInfo, accessToken: { token, expiresIn: duration } } },
      };
    }
    return { status: 400, json: { message: 'Incorrect user credentials.' } };
  }

  return { status: 400, json: { message: 'Incorrect user credentials.' } };
}

/**
 * Retireves a user from the database.
 *
 * @param  {String} id        User's ID
 * @param  {String} token     User's original token
 * @return {Object}           Object containing a status and json response property
 */
async function retrieveUser(id, token) {
  const user = await User.findById(id);

  if (user) {
    if (user._doc.stocks.length > 0) {
      await User.populate(user, 'stocks');
    }

    const { password, ...userInfo } = user._doc;

    const duration = 3600;

    return {
      status: 200,
      json: { user: { ...userInfo, accessToken: { token, expiresIn: duration } } },
    };
  }

  return { status: 400, json: { message: 'Incorrect user credentials.' } };
}

module.exports = { createNewUser, authenticateUser, retrieveUser };
