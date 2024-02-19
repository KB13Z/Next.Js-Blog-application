import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected to ${connection.connection.host}`)
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

export { connectToDatabase };