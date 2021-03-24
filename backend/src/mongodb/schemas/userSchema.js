const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    valitate: {
      valitator: (email) => {
        const emailRegex = /^\S+@\S+.\S$/;
        return emailRegex.test(email); // Check if email format is valid
      },
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  buyingPower: {
    type: Number,
    default: 0,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
