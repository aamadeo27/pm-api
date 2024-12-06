import gql from "graphql-tag"

export const typeDefs = gql`
  type Team {
    id: Int!
    name: String!
    created_at: DateTime!

    members: [User]!
    projects: [Project]!
  }

  type Mutation {
    create_team(name: String!): Team!
    update_team(id: Int!, name: String!): Team!
    delete_team(id: Int!): Team!
  }

  type Query {
    team(id: Int!): Team
    teams(name: String): [Team!]
  }
`
