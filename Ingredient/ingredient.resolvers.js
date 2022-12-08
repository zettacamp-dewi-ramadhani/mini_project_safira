const Ingredient = require("./ingredient.model");
const Recipe = require("../Recipe/recipe.model");

// insert new ingredient data
const insertIngredient = async (parent, { input }) => {
  if (!input) {
    // no input
    throw new Error("Nothing to insert");
  } else {
    const { name, stock } = input;
    // verify data already exists by name
    const dataName = new RegExp(name, "i");
    const verify = await Ingredient.findOne({ name: dataName });

    if (verify != null) {
      // the data already exist by name
      throw new Error("Ingredient has been include");
    } else {
      if (stock < 0) {
        throw new Error("Can't put stock below then 0");
      } else {
        let data = new Ingredient({
          name: name,
          stock: stock
        });
        // save data
        await data.save();
        return data;
      }
    }
  }
};

// show all ingredient data
const getAllIngredients = async (parent, { filter, paging }) => {
  // array variable to save any query for aggregate
  let aggregateQuery = [
    {
      // default sort descanding
      $sort: {
        created_at: -1
      }
    }
  ];

  // array variable to save any match aggregate
  let matchQuerry = {
    $and: [
      // default match
      {
        status: "active"
      }
    ]
  };

  // count data for pagination
  let count = await Ingredient.count();

  // if any filter input
  if (filter) {
    if (filter.name) {
      const search = new RegExp(filter.name, "i");
      matchQuerry.$and.push({
        name: search
      });
    }

    if (filter.stock >= 0) {
      if (filter.stock === 0) {
        throw new Error("Filter stock must greater then 0");
      } else if (filter.stock === null) {
        throw new Error(`Filter stock can't null`);
      } else {
        matchQuerry.$and.push({
          stock: filter.stock
        });
      }
    }
  }

  // push match query
  if (matchQuerry.$and.length) {
    aggregateQuery.push({
      $match: matchQuerry
    });
    // update count data after push array
    let updateCount = await Ingredient.aggregate(aggregateQuery);
    count = updateCount.length;
  }

  // if any pagination input
  if (paging) {
    const { limit, page } = paging;
    aggregateQuery.push(
      {
        // default sort descanding
        $sort: {
          created_at: -1
        }
      },
      {
        $skip: page * limit
      },
      {
        $limit: limit
      }
    );
  }

  // no argument
  if (!aggregateQuery.length) {
    let result = await Ingredient.find();
    return result;
  }

  let result = await Ingredient.aggregate(aggregateQuery);
  result = {
    data: result,
    TotalDocument: count,
    countResult: result.length
  };
  return result;
};

// show one/detail ingredient data by id
const getOneIngredient = async (parent, { filter }) => {
  if (!filter) {
    throw new Error("Nothing to show");
  } else {
    const { id } = filter;
    let result = await Ingredient.findOne({
      _id: id,
      status: "active"
    });
    return result;
  }
};

// update stock ingredient
const updateIngredient = async (parent, { input }) => {
  if (!input) {
    throw new Error("Nothing to update");
  } else {
    const { id, newStock } = input;
    if (newStock < 0) {
      throw new Error("Can't put stock below then 0");
    } else {
      let data = await Ingredient.findByIdAndUpdate(
        {
          _id: id
        },
        {
          $set: {
            stock: newStock
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

// check if ingredient connected / existed in any recipe by id
const validateDelete = async id => {
  const result = await Recipe.find({
    "ingredients.ingredient_id": id
  });
  return result;
};

// delete ingredient
const deleteIngredient = async (parent, { input }, ctx) => {
  if (!input) {
    throw new Error("Input the data first");
  } else {
    const { id } = input;
    // check ingredent in recipe
    const validate = await validateDelete(id);
    if (validate == 0) {
      let result = await Ingredient.findByIdAndUpdate(
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
    } else {
      throw new Error("The Ingredients already use in recipes");
    }
  }
};

const IngredientResolvers = {
  Query: {
    getAllIngredients,
    getOneIngredient
  },

  Mutation: {
    insertIngredient,
    updateIngredient,
    deleteIngredient
  }
};

module.exports = { IngredientResolvers };