import gql from "graphql-tag"

export const typeDefs = gql`
  type Project {
    id: Int!
    name: String!
    team_id: Int!
    created_at: DateTime!
    updated_at: DateTime!

    team: Team!
    tasks: [Task]!
  }
`
