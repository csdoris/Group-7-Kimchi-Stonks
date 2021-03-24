const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    valitate: {
      valitator: (email) => {
        return ^\S+@\S+.\S$.test(email); // Check if email format is valid
      },
    },
  },
  password: String,
  buyingPower: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
