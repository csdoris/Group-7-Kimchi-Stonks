const bcrypt = require('bcrypt');

const User = require('../mongodb/schemas/userSchema');

/**
 * Checks if the user email already exists in the database
 *
 * @param  {String} email User's email
 * @return {boolean}      True OR False
 */
async function isUserUnique(email) {
  const user = User.findOne({ email });
  return user ? false : true;
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

  return { status: 201, json: undefined };
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
    if (user.password === password) {
      return { status: 200, json: { user } };
    }
    return { status: 400, json: { message: 'Incorrect user credentials.' } };
  }

  return { status: 400, json: { message: 'Incorrect user credentials.' } };
}

module.exports = { createNewUser, authenticateUser };
