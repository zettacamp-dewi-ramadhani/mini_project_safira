const {gql} = require('apollo-server-express');

const IngredientTypeDefs = gql`
    type Ingredients {
        _id : ID,
        name : String,
        stock : Int,
        status : Status,
         created_at : String
    }

    type Ingredients_count {
        TotalDocument: Int,
        countResult : Int,
        data : [Ingredients]
    }
    enum Status {
        active,
        deleted
    }

    input Paging {
        page : Int,
        limit : Int,
    }

    input DataFilterIngredients{
        name : String,
        stock : Int,
    }

    input OneDataFilter{
        id : ID
    }

    input DataInsert {
        name : String,
        stock : Int
    }

    input DataUpdate {
        id : ID,
        newStock : Int
    }

    input DataDelete{
        id : ID
    }

    type Query {
        getAllIngredients(filter : DataFilterIngredients, paging : Paging) : Ingredients_count,
        getOneIngredient(filter : OneDataFilter) : Ingredients
    }

    type Mutation {
        insertIngredient(input : DataInsert) : Ingredients
        updateIngredient(input : DataUpdate) : Ingredients
        deleteIngredient(input : DataDelete) : Ingredients
    }
`

module.exports = {IngredientTypeDefs}