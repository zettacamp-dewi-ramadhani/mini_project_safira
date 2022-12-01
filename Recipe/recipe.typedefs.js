const {gql} = require('apollo-server-express');

const RecipeTypeDefs = gql`
    type Recipes {
        _id : ID,
        recipe_name : String,
        ingredients : [Ingredient_Detail],
        price : Int,
        image : String,
        available : Int,
        status : Status,
        special_offers : Boolean,
        highlight : Boolean,
        count_result: Int,
        total_count : Int
    }

    type Ingredient_Detail {
        ingredient_id : Ingredients,
        stock_used : Int
    }

    enum Status {
        active,
        deleted,
        draft
    }

    input Paging {
        page : Int,
        limit : Int
    }

    input DataFilterForRecipe {
        recipe_name : String,
        price : Int
    }

    input DetailIngredientForRecipe {
        ingredient_id : ID,
        stock_used : Int
    }
    
    input DataInputRecipe {
        recipe_name : String,
        ingredients : [DetailIngredientForRecipe]
        price : Int,
        image : String
    }

    input OneDataFilter{
        id : ID
    }

    input DataUpdateRecipe {
        id : ID,
        newName : String,
        newIngredient : [DetailIngredientForRecipe],
        price : Int,
        image : String,
        status : Status,
        special: Boolean,
        highlight: Boolean
    }

    input DataDeleteRecipe{
        id : ID
    }

    type Query {
        getAllRecipes(filter : DataFilterForRecipe, paging : Paging, status : Status, special:Boolean, highlight:Boolean) : [Recipes],
        getOneRecipe(filter : OneDataFilter) : Recipes
    }

    type Mutation {
        createRecipe(input : DataInputRecipe) : Recipes,
        updateRecipe(input : DataUpdateRecipe) : Recipes,
        deleteRecipe(input : DataDeleteRecipe) : Recipes
    }
`

module.exports = {RecipeTypeDefs};