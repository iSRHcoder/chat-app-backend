import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectToMongoDb from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/socket.js';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from specified origins
    const allowedOrigins = [
      'http://localhost:5173',
      'https://chat-app-frontend-mu-dusky.vercel.app',
    ]; // Add your frontend URL here
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  connectToMongoDb();
  console.log('server is running on:', PORT);
});
