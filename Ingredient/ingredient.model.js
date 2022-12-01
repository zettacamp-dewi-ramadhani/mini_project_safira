const {db, mongoose} = require('../Controller/database');
const moment = require('moment')

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  stock: { type: Number },
  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active"
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

const Ingredient = mongoose.model('ingredients', ingredientSchema);
module.exports = Ingredient;