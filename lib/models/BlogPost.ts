import mongoose, {Document} from "mongoose"

const blogPostSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        tag: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

export interface IBlogPost extends Document {
    _id: string,
    image: string,
    title: string,
    description: string,
    tag: string,
    createdAt: Date,
}

let BlogPostModel: mongoose.Model<IBlogPost>

try {
    BlogPostModel = mongoose.model<IBlogPost>("BlogPost")
} catch {
    BlogPostModel = mongoose.model<IBlogPost>("BlogPost", blogPostSchema)
}

export default BlogPostModel