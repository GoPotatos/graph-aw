import { APIGatewayProxyEvent, Context } from "aws-lambda"

import { createLambdaServer } from "../src/server"

export const handler = async (event: APIGatewayProxyEvent, ctx: Context) => {
    console.log("handler", event.path)
    const server = createLambdaServer(event, ctx)
    return new Promise((resolve, reject) => {
        const cb = (
            err: Error | null | string | undefined
            , args: any) =>
            err ? reject(err) : resolve(args)
        return server.createHandler()({
            ...event,
            requestContext: event.requestContext || ctx || {},
        }, ctx, cb)
    })
}