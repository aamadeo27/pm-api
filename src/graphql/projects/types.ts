import gql from "graphql-tag"

export type ProjectUpdateInput = {
  id: number
  name?: string
  thumbnail?: string
  completed_at?: Date
}

export type ProjectQueryInput = {
  name?: string
  team_id?: number
}

export const typeDefs = gql`
  type Project {
    id: Int!
    name: String!
    thumbnail: String
    team_id: Int!
    created_at: DateTime!
    updated_at: DateTime!
    completed_at: DateTime

    team: Team!
    tasks: [Task]!
  }

  input ProjectUpdateInput {
    id: Int!
    name: String
    thumbnail: String
    completed_at: DateTime
  }

  type Mutation {
    create_project(name: String!): Project!
    update_project(args: ProjectUpdateInput!): Project!
    delete_project(id: Int!): Project!
  }

  type Query {
    project(id: Int!): Project
    projects(name: String, team_id: Int): [Project!]
  }
`
