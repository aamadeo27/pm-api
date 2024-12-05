import gql from "graphql-tag"

export type TaskCreateInput = {
  name: string
  description: string
  project_id: number
}

export type TaskUpdateInput = {
  id: number
  name?: string
  description?: string
  assignee_id?: number
}

export type TaskQueryInput = {
  name?: string
  description?: string
  assignee_id?: number
  project_id?: number
  team_id?: number
}

export const typeDefs = gql`
  input TaskCreateInput {
    name: String!
    description: String!
    project_id: Int!
  }

  input TaskUpdateInput {
    id: Int!
    name: String
    description: String
    assignee_id: Int
  }

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

  type Mutation {
    create_task(args: TaskCreateInput!): Task!
    update_task(args: TaskUpdateInput!): Task!
    delete_task(id: Int!): Task!
  }

  type Query {
    task(id: Int!): Task
    tasks(name: String, description: String, team_id: Int, project_id: Int): [Task!]
  }
`
