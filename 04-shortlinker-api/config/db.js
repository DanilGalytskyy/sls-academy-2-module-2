import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
export default connectDB;