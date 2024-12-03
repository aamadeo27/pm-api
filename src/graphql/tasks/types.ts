import gql from "graphql-tag"

export const typeDefs = gql`
  type Task {
    id: Int!
    name: String!
    description: String!
    project_id: Int!
    assignee_id: Int
    created_at: DateTime!
    updated_at: DateTime!

    project: Project!
    assignee: User
  }
`
