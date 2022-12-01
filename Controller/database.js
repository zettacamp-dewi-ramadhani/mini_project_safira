const mongoose = require('mongoose');

const db = mongoose
  .connect("mongodb+srv://chocorange:miniproject@zettacamp.k2k8zav.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));

module.exports = {db, mongoose};
