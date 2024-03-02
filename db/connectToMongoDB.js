import mongoose from 'mongoose';

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Connection to MongoDB failed:', err.message);
  }
};

export default connectToMongoDb;
