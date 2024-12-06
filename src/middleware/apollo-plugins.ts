import { ApolloServerPlugin, GraphQLFieldResolverParams, GraphQLRequestListener } from "@apollo/server";
import { AuthorizationError } from "../errors/ApolloCustomErrors";
import { Context } from "../graphql";
import { allowRoleGQL } from "../security";

export const authPlugin: ApolloServerPlugin<Context> = {
  async requestDidStart(): Promise<GraphQLRequestListener<Context>> {
    return {
      async executionDidStart(){
        return {
          willResolveField({ contextValue, info }) {
            if (info.fieldName !== 'create_user' && !contextValue.user) {
              throw new AuthorizationError(`Unauthorized access`)
            }
          }
        }
      }
    }
  }
}

export const rolePlugin: ApolloServerPlugin<Context> = {
  async requestDidStart(): Promise<GraphQLRequestListener<Context>> {
    return {
      async executionDidStart(){
        return {
          willResolveField({ contextValue, info }) {
            if (info.fieldName === 'create_user') return
            if (['Query','Mutation'].includes(info.parentType.name)){
              allowRoleGQL(contextValue.user!.role, info.fieldName)
            }
          }
        }
      }
    }
  }
}

