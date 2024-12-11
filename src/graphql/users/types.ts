import { AppRole } from "@prisma/client"
import gql from "graphql-tag"

export type UserCreationInput = {
  name: string
  email: string
  password: string
  team_id: number
}

export type UserUpdateInput = {
  id: number
  name?: string
  avatar_url?: string
  password?: string
  team_id?: number
  active?: boolean
  role?: AppRole
}

export type UsersQueryInput = {
  name?: string
  team_id?: number
  active?: boolean
  role?: AppRole
}

export const typeDefs = gql`
  enum AppRole {
    admin
    project_manager
    team_member
  }

  type User {
    id: Int!
    name: String!
    avatar_url: String
    email: String!
    active: Boolean!
    role: AppRole!
    team_id: Int!

    team: Team!
    tasks: [Task]!
  }

  input UserUpdateInput {
    id: Int!
    name: String
    avatar_url: String
    password: String
    active: Boolean
    role: AppRole
    team_id: Int
  }

  input UserCreateInput {
    email: String!
    name: String!
    password: String!
    team_id: Int!
  }

  type Mutation {
    create_user(args: UserCreateInput!): Boolean!
    update_user(args: UserUpdateInput!): User!
    delete_user(id: Int!): User!
  }

  type Query {
    current_user: User!
    user(id: Int!): User!
    users(name: String, role: AppRole, team_id: Int, active: Boolean): [User!]
  }
`
