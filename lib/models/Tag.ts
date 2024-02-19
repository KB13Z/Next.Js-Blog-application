import mongoose, {Document} from "mongoose"

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

export interface ITag extends Document {
    name: string,
};

let TagModel: mongoose.Model<ITag>

try {
    TagModel = mongoose.model<ITag>("Tag")
} catch (error) {
    console.error('Error creating TagModel:', error);
    TagModel = mongoose.model<ITag>("Tag", tagSchema)
}

export default TagModel