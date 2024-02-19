import mongoose, {Document} from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        }
    },
    {timestamps: true}
)

export interface IUser extends Document {
    _id: string
    username: string
    password: string
    email: string
    createdAt: Date
}

let UserModel: mongoose.Model<IUser>

try {
    UserModel = mongoose.model<IUser>("User")
} catch {
    UserModel = mongoose.model<IUser>("User", userSchema)
}

export default UserModel