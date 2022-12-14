import { gql } from "apollo-server-lambda"

export const typeDefs = gql`
    type Token{
        token:String!
    }
    type User{
        id:ID!
        name:String!
        email:String!
    }

    type Query {
        user(id:ID!):User
        login(email:String! password:String!):Token!
    }

    type Mutation{
        createUser(name:String! email:String! password:String!):User!
    }
`