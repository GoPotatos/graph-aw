import mongoose, { Error, Schema } from "mongoose"
import { hashSync, genSaltSync, compareSync } from "bcrypt"

interface IUser {

    name: string;
    email: string;
    password: string;
}

type ComparePassword = {
    candidatePassword: string,
    cb: (err: Error | null, isMatch: boolean) => void


}

const UserSchema = new Schema<IUser>({
    email: {
        required: true,
        unique: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
        minLength: 3,
        maxLength: 32
    },
    password: {
        required: true,
        type: String
    },
}, {
    methods: {
        comparePasswords({ candidatePassword, cb }: ComparePassword) {
            const user = this
            const isMatch = compareSync(candidatePassword, user.password)
            cb(null, isMatch)
        }
    }
})

UserSchema.pre("save", function (next) {
    const user = this
    if (!this.isModified("password")) return next()
    const salt = genSaltSync(10)
    const hash = hashSync(user.password, salt)
    user.password = hash
    next()
})

export const userModel = mongoose.model<IUser>("User", UserSchema)
export type UserModelType = typeof userModel