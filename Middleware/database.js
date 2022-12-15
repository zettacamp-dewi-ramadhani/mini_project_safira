const mongoose = require("mongoose");

// connect database
mongoose
  .connect(
    "mongodb+srv://chocorange:miniproject@zettacamp.k2k8zav.mongodb.net/zettacamp?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));

module.exports = { mongoose };
