import { AuthenticationError } from "../errors/ApolloCustomErrors"

export default function(userId: number | undefined){
  if (!userId) {
    throw new AuthenticationError('You must be logged in to perform this action')
  }
}
