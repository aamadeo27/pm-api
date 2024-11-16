import gql from "graphql-tag"

export type UserCreationInput = {
  name: string
  email: string
  password: string
}

export const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    active: Boolean!
  }

  input UserCreationInput {
    name: String!
    email: String!
    password: String!
  }

  type Mutation {
    create_user(email: String!, name: String!, password: String!): User
  }

  type Query {
    hello: String
  }
`
