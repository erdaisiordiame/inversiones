import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || process.env.VITE_MONGO_URI || 'mongodb://localhost:27017/'
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || process.env.VITE_MONGO_DB_NAME || 'db_trading'
const MONGO_URL = `${MONGO_URI}${MONGO_DB_NAME}`

let isConnected = false

export async function connectMongo() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(MONGO_URL, {
      dbName: MONGO_DB_NAME,
      serverSelectionTimeoutMS: Number(process.env.VITE_MONGO_CONN_TIMEOUT || process.env.MONGO_CONN_TIMEOUT || 30000),
    })
    isConnected = true
    console.log('Server: connected to MongoDB', MONGO_URL)
  } catch (error) {
    console.error('Server: MongoDB connection error', error)
    throw error
  }
}

export const Decimal128 = mongoose.Types.Decimal128
export const ObjectId = mongoose.Types.ObjectId
export default mongoose
