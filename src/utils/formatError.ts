import { GraphQLError, GraphQLFormattedError } from "graphql"

export default function formatError(formattedError: GraphQLFormattedError, error: unknown){
  console.error(error)

  const graphQLError = error as GraphQLError;

  if(graphQLError.extensions?.code === 'AUTHENTICATION_ERROR') {
    return { 
      message: 'Authentication Failed' + graphQLError.message,
      code: graphQLError.extensions.code
    }
  } else if(graphQLError.extensions?.code === 'AUTHARIZATION_ERROR') {
    return { 
      message: 'Authorization Failed' + graphQLError.message,
      code: graphQLError.extensions.code
    }
  }

  return {
    message: graphQLError.message,
    code: 'INTERNAL_SERVER_ERROR',
  }
}