import { GraphQLError, GraphQLFormattedError } from "graphql"

export default function formatError(formattedError: GraphQLFormattedError, error: unknown){
  console.error(error)

  const graphQLError = error as GraphQLError;

  if(graphQLError.extensions?.code === 'AUTHENTICATION_ERROR') {
    return { 
      message: 'Authentication Failed: ' + graphQLError.message,
      code: graphQLError.extensions.code
    }
  } else if(graphQLError.extensions?.code === 'AUTHORIZATION_ERROR') {
    return { 
      message: 'Authorization Failed: ' + graphQLError.message,
      code: graphQLError.extensions.code
    }
  } else if(graphQLError.extensions?.code === 'INVALID_INPUT_ERROR') {
    return { 
      message: 'Bad Request: ' + graphQLError.message,
      code: graphQLError.extensions.code
    }
  } else if(graphQLError.extensions?.code === 'NOT_FOUND_ERROR') {
    return { 
      message: 'Not Found: ' + graphQLError.message,
      code: graphQLError.extensions.code
    }
  }

  return {
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  }
}