import gql from "graphql-tag"

export type ProjectUpdateInput = {
  id: number
  name: string
}

export type ProjectQueryInput = {
  name?: string
  team_id?: number
}

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

  type Mutation {
    create_project(name: String!): Project!
    update_project(id: Int!, name: String!): Project!
    delete_project(id: Int!): Project!
  }

  type Query {
    project(id: Int!): Project
    projects(name: String, team_id: Int): [Project!]
  }
`
