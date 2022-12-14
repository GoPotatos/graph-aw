// import { UserModelType } from "./model"

// export const resolvers = {
//     Query: {
//         user: async (_parent: any, { id }: any,
//             { models: { userModel } }: { models: { userModel: UserModelType } }) => {
//             console.log("id", id)
//             const user = userModel.findById(id).exec()
//             return user
//         }
//     },
//     Mutation: {
//         createUser: async (_parent: any, { name, email, password }: any,
//             { models: { userModel } }: { models: { userModel: UserModelType } }) => {
//             console.log("creating", name, email, password)
//             const user = await userModel.create({ name, email, password })
//             await user.save()
//             return user
//         }
//     }
// }

import { userModel } from "./model"

import { compareSync } from "bcrypt"
import { sign } from "jsonwebtoken"
import mongoose from "mongoose"

import { Resolvers } from "./generated/graphql"
// async function asd() {
//     const user = await userModel.findOne({ email: "" }).exec()
// }
// user.method
export const resolvers: Resolvers = {
    Query: {
        user: async (_, { id },
            { auth, models: { userModel } }) => {
            console.log("id", id, Date.now(), auth)
            // if (!auth) return null
            try {
                console.time()
                const user = await userModel.findById(id).exec()
                console.timeEnd()
                console.log("user", Date.now())
                await mongoose.disconnect()
                console.log("disconnected")
                return user
            }
            catch (err) {
                console.log("Got Error", Date.now(), err)
                return null
            }
        },
        login: async (_, { email, password }, { models: { userModel } }) => {
            let token = ""
            const user = await userModel.findOne({ email }).exec()
            console.log("login", user, email, password)
            const isPasswordCorrect = compareSync(password, user.password)
            if (!isPasswordCorrect) return { token }
            token = sign({ id: user.id }, "my_secret")
            return { token }
        }
    },
    Mutation: {
        createUser: async (_, { name, email, password },
            { models: { userModel } }) => {
            console.log("creating", name, email, password)
            const user = await userModel.create({ name, email, password })
            await user.save()
            return user
        }
    }
}
