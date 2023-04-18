const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url);   //we don't need to add this line in mongoose v6
};

module.exports = connectDB;
