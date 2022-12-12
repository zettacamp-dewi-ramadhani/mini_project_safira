const User = require("../User/user.model");
const jwt = require("jsonwebtoken");
const tokenSecret = "secretZettaCamp";

// get token to access
const authJwt = async (resolver, parent, args, ctx, info) => {
  const auth = ctx.req.get("Authorization");
  if (!auth) {
    throw new Error("Unauthorized");
  } else {
    const token = auth.replace("Bearer ", "");
    const verify = jwt.verify(token, tokenSecret);
    const getUser = await User.find({
      _id: verify.id
    });
    ctx.user = getUser;
    ctx.token = auth;
  }
  return resolver();
};

// request an authorization
module.exports = {
  Query: {
    getAllUsers: authJwt,
    // getOneUser: authJwt,
    getAllIngredients: authJwt,
    getOneIngredient: authJwt,
    // getAllRecipes : authJwt,
    // getOneRecipe : authJwt,
    getAllTransactions: authJwt,
    getOneTransactions: authJwt,
    getIncome: authJwt,
    getSuccessTransactions: authJwt
  },

  Mutation: {
    updateUser: authJwt,
    deleteUser: authJwt,
    insertIngredient: authJwt,
    updateIngredient: authJwt,
    deleteIngredient: authJwt,
    createRecipe: authJwt,
    updateRecipe: authJwt,
    deleteRecipe: authJwt,
    addCart: authJwt,
    deleteTransaction: authJwt,
    deleteMenu: authJwt,
    updateOrderStatus: authJwt,
    updateAmount: authJwt,
    topUp: authJwt
  }
};
