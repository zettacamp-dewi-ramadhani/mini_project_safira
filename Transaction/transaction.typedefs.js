const {gql} = require('apollo-server-express');

const TransactionTypeDefs = gql`
    # scalar Date

    type Transactions {
        _id : ID,
        user_id : Users,
        menu : [Detail_Menu],
        total : Int,
        order_status : Order,
        order_date : String,
        status : Status
    }

    type Detail_Menu {
        _id : ID,
        recipe_id : Recipes,
        amount : Int,
        note : String
    }

    enum Order {
        success,
        failed,
        pending
    }

    enum Status {
        active,
        deleted
    }

    input DataDeleteTransaction {
        id : ID
    }

    input DataInputTransaction {
        menu : [Detail]
    }

    input Detail {
        recipe_id : ID,
        amount : Int,
        note : String
    }

    input DataFilterTransaction {
        user_lname : String,
        recipe_name : String,
        order_status : Order,
        order_date : String
    }

    input OneFilterTransaction {
        id : ID
    }

    input Paging {
        page : Int,
        limit : Int
    }

    input DeleteMenu {
        id : ID
    }

    type Query {
        getAllTransactions(filter : DataFilterTransaction, pagination : Paging) : [Transactions],
        getOneTransactions(filter : OneFilterTransaction) : Transactions
    }

    type Mutation {
        addCart(input : DataInputTransaction) : Transactions,
        deleteTransaction(input : DataDeleteTransaction) : Transactions,
        deleteMenu(input : DeleteMenu) : Transactions,
        updateOrderStatus : Transactions
    }
`

module.exports = {TransactionTypeDefs}