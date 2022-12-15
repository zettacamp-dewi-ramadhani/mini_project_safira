const { mongoose } = require("../Middleware/database");

// create schema for database
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
  image: {
    type: String,
    default:
      "https://th.bing.com/th/id/R.855e8ca01684f0d61e302ba09a177bfd?rik=TbKuqNR1U%2bV6Iw&riu=http%3a%2f%2fwww.fremontgurdwara.org%2fwp-content%2fuploads%2f2020%2f06%2fno-image-icon-2.png&ehk=CSKwfMp5gN3Q7qhs6urcmM7WX1EHsd%2f3sCS8jJu8lRU%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
  },
  available: { type: Number },
  status: {
    type: String,
    enum: ["active", "deleted", "draft"],
    default: "draft"
  },
  discount: {
    type: Number,
    default: 0
  },
  special_offers: {
    type: Boolean,
    default: false
  },
  highlight: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
    default: Date.now()
  }
});

// create model from schema and database
const Recipe = mongoose.model("recipes", recipeSchema);
module.exports = Recipe;
