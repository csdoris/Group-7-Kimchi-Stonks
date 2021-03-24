const User = require('../mongodb/schemas/userSchema');

async function createNewUser(firstName, lastName, email, password) {
  const newUser = new User({ firstName, lastName, email, password });
  const { err } = await newUser.save();

  if (err) {
    return { status: 400, json: { message: 'Error create new user.' } };
  }

  return { status: 201, json: undefined };
}

module.exports = { createNewUser };
