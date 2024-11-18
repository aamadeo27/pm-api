import { AppRole } from "@prisma/client"
import { AuthorizationError } from "../errors/ApolloCustomErrors"
import ac from "./permissions"


export async function allowRoleGQL(role: AppRole, gqlEndpoint: string){
  if (role === AppRole.admin) return

  if (!ac.can(role).read(gqlEndpoint).granted){
    throw new AuthorizationError(`Unauthorized access to ${gqlEndpoint} by ${role}`)
  }
}