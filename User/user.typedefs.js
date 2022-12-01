const {gql} = require('apollo-server-express');

const UserTypeDefs = gql`
    type Users {
        _id : ID,
        email : String,
        first_name : String,
        last_name : String,
        user_type : [UserType],
        status : Status,
        count : Int,
        total_count : Int
    }

    type UserType {
        name : String,
        view : Boolean
    }

    enum Status {
        active,
        deleted
    }

    enum Role {
        admin, 
        user
    }

    type AuthLoad {
        token : String,
        user : Users
    }

    input UserLogin{
        email : String,
        password : String
    }

    input UserSignup {
        email : String,
        password : String,
        first_name : String,
        last_name : String,
        role : Role
    }

    input Paging {
        page : Int,
        limit : Int
    }

    input UserFilter{
        email : String,
        first_name : String,
        last_name : String,
    }

    input OneUserFilter{
        id : ID,
        email : String
    }

    input UserUpdate {
        newEmail : String,
        newPassword : String,
        newFirst_name : String,
        newLast_name : String
    }

    input UserDelete{
        id : ID
    }

    input ForgetPass {
        email : String,
        password : String
    }

    type Query{
        getAllUsers(filter: UserFilter, paging : Paging ) : [Users],
        getOneUser(filter : OneUserFilter) : Users
    }

    type Mutation {
        signUp(input: UserSignup) : Users,
        login(input: UserLogin) : AuthLoad,
        updateUser(input : UserUpdate) : Users,
        deleteUser(input: UserDelete) : Users,
        forgetPass(input : ForgetPass) : Users
    }
`

module.exports = {UserTypeDefs}