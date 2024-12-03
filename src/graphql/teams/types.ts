import gql from "graphql-tag"

export const typeDefs = gql`
  type Team {
    id: Int!
    name: String!
    created_at: DateTime!

    members: [User]!
    projects: [Project]!
  }
`
