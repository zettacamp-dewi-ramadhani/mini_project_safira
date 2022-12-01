const { gql } = require("apollo-server-express");

const TransactionTypeDefs = gql`
  type Transactions {
    _id: ID
    user_id: Users
    menu: [Detail_Menu]
    total: Int
    order_status: Order
    order_date: String
    status: Status
    count: Int,
    total_docs : Int
  }

  type Detail_Menu {
    _id: ID
    recipe_id: Recipes
    amount: Int
    note: String
  }

  enum Order {
    success
    failed
    pending
  }

  enum Status {
    active
    deleted
  }

  input DataDeleteTransaction {
    id: ID
  }

  input DataInputTransaction {
    menu: [Detail]
  }

  input Detail {
    recipe_id: ID
    amount: Int
    note: String
  }

  input DataFilterTransaction {
    user_lname: String
    recipe_name: String
    order_status: Order
    order_date: String
  }

  input OneFilterTransaction {
    id: ID
  }

  input Paging {
    page: Int
    limit: Int
  }

  input DeleteMenu {
    id: ID
  }

  input UpdateAmount {
    id : ID,
    amount : Int,
    note : String
  }

  type Query {
    getAllTransactions(filter: DataFilterTransaction, pagination: Paging): [Transactions]
    getOneTransactions(filter: OneFilterTransaction): Transactions
  }

  type Mutation {
    addCart(input: DataInputTransaction): Transactions
    deleteTransaction(input: DataDeleteTransaction): Transactions
    deleteMenu(input: DeleteMenu): Transactions
    updateOrderStatus: Transactions,
    cancelOrder: Transactions,
    updateAmount(input : UpdateAmount) : Transactions
  }
`;

module.exports = { TransactionTypeDefs };