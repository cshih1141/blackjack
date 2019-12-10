const User = require('../models/users.js');

const findUserAndUpdate = (users, req, res) => {
  User.findOneAndUpdate({email: users.email}, users, {
    upsert: true
  }, (err, result) => {
    if(err) {
      res.send(err);
    } else {
      if(result) {
        res.send('update');
      } else {
        res.send('insert');
      }
    }
  });
};
module.exports = findUserAndUpdate;
