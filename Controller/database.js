const mongoose = require('mongoose');

const db = mongoose
  .connect("mongodb://localhost:27017/zettacamp_safira")
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));

module.exports = {db, mongoose};