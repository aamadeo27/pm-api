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

export class InvalidInputError extends ApolloError { 
  constructor(message: string, statusCode: number = 400){
    super(message, 'INVALID_INPUT_ERROR')
    Object.setPrototypeOf(this, ApolloError.prototype)
  }
}

export class NotFoundError extends ApolloError { 
  constructor(message: string, statusCode: number = 404){
    super(message, 'NOT_FOUND_ERROR')
    Object.setPrototypeOf(this, ApolloError.prototype)
  }
}