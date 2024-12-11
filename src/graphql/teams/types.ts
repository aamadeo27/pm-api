import gql from "graphql-tag"

export type TeamUpdateInput = {
  id: number
  name?: string
  thumbnail?: string
}

export const typeDefs = gql`
  type Team {
    id: Int!
    name: String!
    thumbnail: String
    created_at: DateTime!

    members: [User!]!
    projects: [Project!]!
  }

  input TeamUpdateInput {
    id: Int!
    name: String
    thumbnail: String
  }

  type Mutation {
    create_team(name: String!): Team!
    update_team(args: TeamUpdateInput!): Team!
    delete_team(id: Int!): Team!
  }

  type Query {
    team(id: Int!): Team
    teams(name: String): [Team!]
  }
`
