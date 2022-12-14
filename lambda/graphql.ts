import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda"

import { createLambdaServer } from "../src/server"

export const handler: Handler = async (event: APIGatewayProxyEvent, ctx: Context) => {
    console.log("handler", Date.now())
    return createLambdaServer(event, ctx).createHandler()({
        ...event,
        requestContext: event.requestContext || ctx || {},
    }, ctx, () => { })

}

/*
import { APIGatewayProxyEvent, Context } from "aws-lambda"

import { createLambdaServer } from "../src/server"

export const handler = async (event: APIGatewayProxyEvent, ctx: Context) => {
    ctx.callbackWaitsForEmptyEventLoop = false;
    console.log("handler", Date.now())
    const server = createLambdaServer(event, ctx)
    return new Promise((resolve, reject) => {
        const cb = (
            err: Error | null | string | undefined
            , args: any) =>
            err ? reject(err) : resolve(args)
        return server.createHandler({
            expressGetMiddlewareOptions: {
                cors: {
                    origin: "*"
                }
            }
        })({
            ...event,
            requestContext: event.requestContext || ctx || {},
        }, ctx, cb)
    })
}
*/