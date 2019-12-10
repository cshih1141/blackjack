const mongoose = require('mongoose');
const db = require('../index.js');

const userSchema = mongoose.Schema({
  userName: String,
  firstName: String,
  lastName: String,
  email: String,
  balance: Number
});

const Users = mongoose.model('users', userSchema);

module.exports = Users;