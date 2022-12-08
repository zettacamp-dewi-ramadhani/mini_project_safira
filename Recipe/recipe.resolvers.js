const Recipe = require("./recipe.model");
const Ingredient = require("../Ingredient/ingredient.model");
const Transaction = require("../Transaction/transaction.model");
const mongoose = require("mongoose");

// add function to get available data from minimum ingredient stock and recipe stock used
async function getAvailable({ ingredients }, args, context, info) {
  const minStock = [];
  // find ingredient from recipes
  for (let ingredient of ingredients) {
    const recipe_ingredient = await Ingredient.findById(
      ingredient.ingredient_id
    );
    if (!recipe_ingredient)
      throw new Error(
        `Ingredient with ID: ${ingredient.ingredient_id} not found`,
        "404"
      );
    // calculate minimum stock
    minStock.push(Math.floor(recipe_ingredient.stock / ingredient.stock_used));
  }
  // check if min stock below 0
  let minus = minStock.some(v => v < 0);
  if (minus == true) {
    let result = 0;
    return result;
  } else {
    let result = Math.min(...minStock);
    return result;
  }
}

// validate ingredient status
const validateIngredient = async ingredients => {
  let available = [];
  for (const data of ingredients) {
    ingredientData = await Ingredient.findOne({
      _id: data.ingredient_id
    });
    if (ingredientData.status == "deleted") {
      available.push(false);
    } else {
      available.push(true);
    }
  }

  const temp = available.includes(true);

  if (temp === true) {
    return true;
  } else {
    return false;
  }
};

// create new recipe
const createRecipe = async (parent, { input }) => {
  const { recipe_name, ingredients, price, image } = input;
  if (!input) {
    throw new Error("No input data");
  } else {
    // check ingredient status
    const validate = await validateIngredient(ingredients);
    if (validate == false) {
      throw new Error("Ingredient is deleted");
    } else {
      const indetify = new RegExp(recipe_name, "i");
      const verify = await Recipe.findOne({ recipe_name: indetify });
      if (verify) {
        throw new Error("Recipe has been include");
      } else {
        if (price <= 0) {
          throw new Error("Price can't 0 or below 0");
        } else {
          let data = new Recipe({
            recipe_name: recipe_name,
            ingredients: ingredients,
            price: price,
            image: image
          });
          await data.save();
          return data;
        }
      }
    }
  }
};

const getAllRecipes = async (
  parent,
  { filter, paging, status, special, highlight }
) => {
  let aggregateQuery = [];

  let matchQuerry = {
    $and: [
      {
        status: {
          $ne: "deleted"
        }
      }
    ]
  };

  if (filter) {
    if (filter.recipe_name) {
      const search = new RegExp(filter.recipe_name, "i");
      matchQuerry.$and.push({
        recipe_name: search
      });
    }

    if (filter.price) {
      matchQuerry.$and.push({
        price: filter.price
      });
    }
  }

  let totalCount = await Recipe.count();
  if (matchQuerry.$and.length) {
    aggregateQuery.push({
      $match: matchQuerry
    });
    let updateCount = await Recipe.aggregate(aggregateQuery);
    totalCount = updateCount.length;
  }

  if (status) {
    aggregateQuery.push(
      {
        $match: {
          status: status
        }
      },
      {
        $sort: {
          created_at: -1
        }
      }
    );
    let updateCount = await Recipe.aggregate(aggregateQuery);
    totalCount = updateCount.length;
  }

  if (special) {
    aggregateQuery.push(
      {
        $match: {
          special_offers: special
        }
      },
      {
        $sort: {
          discount: -1,
          created_at: -1
        }
      }
    );
  }

  if (highlight) {
    aggregateQuery.push(
      {
        $match: {
          highlight: highlight
        }
      },
      {
        $sort: {
          created_at: -1
        }
      }
    );
  }

  if (paging) {
    const { limit, page } = paging;
    aggregateQuery.push(
      {
        $skip: page * limit
      },
      {
        $limit: limit
      },
      {
        $sort: {
          created_at: -1
        }
      }
    );
  }

  if (!aggregateQuery.length) {
    let result = await Recipe.find().lean();
    result = result.map(el => {
      return { ...el, count_result: result.length, total_count: totalCount };
    });
    return result;
  }

  let result = await Recipe.aggregate(aggregateQuery);
  result = result.map(el => {
    return {
      ...el,
      count_result: result.length,
      total_count: totalCount
    };
  });
  return result;
};

const getRecipeLoader = async (parent, args, ctx) => {
  if (parent.ingredient_id) {
    const result = await ctx.recipeLoader.load(parent.ingredient_id);
    return result;
  }
};
const getOneRecipe = async (parent, { filter }) => {
  if (!filter) {
    throw new Error("No data match");
  } else {
    const { id } = filter;
    let result = await Recipe.findOne({
      _id: id
    });
    return result;
  }
};
const updateRecipe = async (parent, { input }) => {
  if (!input) {
    throw new Error("No data");
  } else {
    const {
      id,
      newName,
      newIngredient,
      price,
      image,
      status,
      discount,
      special,
      highlight
    } = input;
    if (price <= 0) {
      throw new Error("Price can't 0 or below 0");
    } else if (discount < 0) {
      throw new Error("discount can't below then 0");
    } else {
      let data = await Recipe.findByIdAndUpdate(
        {
          _id: id
        },
        {
          $set: {
            recipe_name: newName,
            ingredients: newIngredient,
            price: price,
            image: image,
            status: status,
            discount: discount,
            special_offers: special,
            highlight: highlight
          }
        },
        {
          new: true
        }
      );
      return data;
    }
  }
};
const deleteRecipe = async (parent, { input }) => {
  if (!input) {
    throw new Error("No Input Data");
  } else {
    const { id } = input;
    let result = await Recipe.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          status: "deleted"
        }
      },
      {
        new: true
      }
    );
    return result;
  }
};
const RecipeResolvers = {
  Query: {
    getAllRecipes,
    getOneRecipe
  },
  Mutation: {
    createRecipe,
    updateRecipe,
    deleteRecipe
  },
  Ingredient_Detail: {
    ingredient_id: getRecipeLoader
  },
  Recipes: {
    available: getAvailable
  }
};

module.exports = { RecipeResolvers };