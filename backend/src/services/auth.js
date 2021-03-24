const User = require('../mongodb/schemas/userSchema');

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
  const newUser = new User({
    firstName, lastName, email, password,
  });
  const { err } = await newUser.save();

  if (err) {
    return { status: 400, json: { message: 'Error create new user.' } };
  }

  return { status: 201, json: undefined };
}

module.exports = { createNewUser };
