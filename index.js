const express = require("express");
const app = express();
const { gql, ApolloServer, ApolloError } = require("apollo-server-express");

const { merge } = require("lodash");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const cron = require("node-cron");

const { UserTypeDefs } = require("./User/user.typedefs");
const { IngredientTypeDefs } = require("./Ingredient/ingredient.typedefs");
const { RecipeTypeDefs } = require("./Recipe/recipe.typedefs");
const { TransactionTypeDefs } = require("./Transaction/transaction.typedefs");

const { UserResolvers } = require("./User/user.resolvers");
const { IngredientResolvers } = require("./Ingredient/ingredient.resolvers");
const { RecipeResolvers } = require("./Recipe/recipe.resolvers");
const { TransactionResolvers } = require("./Transaction/transaction.resolvers");

const recipeLoader = require("./Recipe/recipe.loader");
const {
  dataUserLoader,
  dataRecipeLoader
} = require("./Transaction/transaction.loader");

const authJwt = require("./Middleware/auth");

const typeDef = gql`
  type Query
  type Mutation
`;

const typeDefs = [
  typeDef,
  UserTypeDefs,
  IngredientTypeDefs,
  RecipeTypeDefs,
  TransactionTypeDefs
];

const resolvers = merge(
  UserResolvers,
  IngredientResolvers,
  RecipeResolvers,
  TransactionResolvers
);

const auth = merge(authJwt);

// const scheduleTask = cron.schedule('* * * * *', ()=>{
//     return cancelResolver
// })

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const protectedSchema = applyMiddleware(executableSchema, auth);

const server = new ApolloServer({
  schema: protectedSchema,
  typeDefs,
  resolvers,
  context: function ({ req }) {
    req;
    return {
      req,
      recipeLoader,
      dataUserLoader,
      dataRecipeLoader
      // scheduleTask
    };
  }
});

server.start().then(res => {
  server.applyMiddleware({ app });
  app.listen(4004, () => console.log("Server Running on Port 4004"));
});
