const {db, mongoose} = require('../Controller/database')

const recipeSchema = new mongoose.Schema({
  recipe_name: {
    type: String,
    unique: true
  },
  ingredients: [
    {
      _id: false,
      ingredient_id: {
        type: mongoose.Schema.ObjectId,
        ref: "ingredients"
      },
      stock_used: { type: Number }
    }
  ],
  price: { type: Number },
  image: { type: String },
  available: { type: Number },
  status: {
    type: String,
    enum: ["active", "deleted", "draft"],
    default: "draft"
  },
  special_offers :{
    type: Boolean,
    default: false
  },
  highlight :{
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
    default: Date.now()
  }
});

const Recipe = mongoose.model('recipes', recipeSchema);
module.exports = Recipe;