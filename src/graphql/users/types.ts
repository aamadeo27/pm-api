import gql from "graphql-tag"

export type UserCreationInput = {
  name: string
  email: string
  password: string
  team_id: number
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
    email: String!
    active: Boolean!
    role: AppRole!
    team_id: Int!

    team: Team!
    tasks: [Task]!
  }

  type Mutation {
    create_user(email: String!, name: String!, password: String!, team_id: Int!): User
  }

  type Query {
    current_user: User
  }
`
