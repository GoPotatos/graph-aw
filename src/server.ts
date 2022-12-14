import { ApolloServer } from "apollo-server"
import { ApolloServer as ApolloLambdaServer } from "apollo-server-lambda"
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from "apollo-server-core"
import mongoose, { Connection, Error } from "mongoose"
import { IncomingHttpHeaders } from "http"
import { APIGatewayProxyEvent, Context, APIGatewayProxyEventHeaders } from "aws-lambda"


import { typeDefs } from "./schemas"
import { resolvers } from "./resolvers"
import { userModel } from "./model"
import { verify } from "jsonwebtoken"

let cachedDB: Connection;

const connectToDatabase = async () => {
    if (cachedDB) return;
    console.log("URI", process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI!, {})
    console.log("Connected", Date.now())
    cachedDB = mongoose.connection
}

const checkAuth = ({ token }: APIGatewayProxyEventHeaders | IncomingHttpHeaders) => {
    if (typeof token === "string") {
        try {
            return verify(token, "my_secret")
        } catch (err) {
            throw new Error(err)
        }
    }
    // throw new Error("Token not found")
    return ""
}

export const createLocalServer = () => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        plugins: [
            process.env.NODE_ENV === "production" ? ApolloServerPluginLandingPageDisabled : ApolloServerPluginLandingPageGraphQLPlayground
        ],
        context: async ({ req: { headers = {} } }) => {
            const auth = checkAuth(headers)
            await connectToDatabase()
            return {
                auth,
                models: { userModel }
            }
        }
    })
}

export const createLambdaServer = (
    { headers }: APIGatewayProxyEvent,
    context: Context
) => {
    return new ApolloLambdaServer({
        typeDefs,
        resolvers,
        introspection: true,
        plugins: [
            process.env.NODE_ENV === "production" ? ApolloServerPluginLandingPageDisabled : ApolloServerPluginLandingPageGraphQLPlayground
        ],
        context: async () => {
            const auth = checkAuth(headers)
            await connectToDatabase()
            return {
                auth,
                models: { userModel }
            }
        }
    })
}