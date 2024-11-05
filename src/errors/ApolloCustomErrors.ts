import { ApolloError } from "apollo-server-errors"

export class AuthenticationError extends ApolloError {
  constructor(message: string){
    super(message, 'AUTHENTICATION_ERROR')
    Object.setPrototypeOf(this, ApolloError.prototype)
  }
}

export class AuthorizationError extends ApolloError {
  constructor(message: string){
    super(message, 'AUTHORIZATION_ERROR')
    Object.setPrototypeOf(this, ApolloError.prototype)
  }
}