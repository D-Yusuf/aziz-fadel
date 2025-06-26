import mongoose from 'mongoose';

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL as string);
        console.log("Connected to database 😎👍")
    } catch (err) {
        console.log("Error connecting with database", err)
    }

}

export default connectDB