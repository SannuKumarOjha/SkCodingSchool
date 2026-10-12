import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is required');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME || 'SkCodingSchool',
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }

};

export default connectDB
