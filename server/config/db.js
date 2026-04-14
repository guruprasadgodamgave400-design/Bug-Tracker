const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const defaultUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bugtracker';
    
    // If the user provided a real remote Atlas URI, use it. 
    // Otherwise, we spin up an in-memory database automatically so you don't need MongoDB installed locally!
    if (defaultUri.includes('mongodb+srv') || (!defaultUri.includes('localhost') && !defaultUri.includes('127.0.0.1'))) {
      const conn = await mongoose.connect(defaultUri);
      console.log(`MongoDB Connected (Remote Atlas): ${conn.connection.host}`);
    } else {
      console.log('Local MongoDB not detected. Spinning up In-Memory MongoDB mock server...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Mock successfully spawned!): ${conn.connection.host}`);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
