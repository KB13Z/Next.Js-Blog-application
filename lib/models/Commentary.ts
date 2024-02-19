import mongoose, {Document} from "mongoose"

const commentarySchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  author: {
    type: String, 
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface ICommentary extends Document {
    _id: string,
    postId: string,
    author: string,
    text: string,
    createdAt: Date,
}

let CommentaryModel: mongoose.Model<ICommentary>

try {
    CommentaryModel = mongoose.model<ICommentary>("Commentary")
} catch (error) {
    console.error('Error creating CommentaryModel:', error);
    CommentaryModel = mongoose.model<ICommentary>("Commentary", commentarySchema)
}

export default CommentaryModel