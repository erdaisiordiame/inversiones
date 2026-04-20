import mongoose from 'mongoose';

const MONGO_URI = import.meta.env.VITE_MONGO_URI || 'mongodb://localhost:27017/';
const MONGO_DB_NAME = import.meta.env.VITE_MONGO_DB_NAME || 'db_trading';

let isConnected = false;

export const connectToMongoDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI + MONGO_DB_NAME);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectFromMongoDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  }
};

export default mongoose;