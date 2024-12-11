import gql from "graphql-tag"

export type TaskCreateInput = {
  name: string
  description: string
  project_id: number
}

export type TaskUpdateInput = {
  id: number
  name?: string
  thumbnail?: string
  description?: string
  assignee_id?: number
  completed_at?: Date
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
    thumbnail: String
    description: String
    assignee_id: Int
    completed_at: DateTime
  }

  type Task {
    id: Int!
    name: String!
    thumbnail: String
    description: String!
    project_id: Int!
    assignee_id: Int
    created_at: DateTime!
    updated_at: DateTime!
    completed_at: DateTime!

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
