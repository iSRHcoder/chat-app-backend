import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectToMongoDb from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/socket.js';
// const bodyParser = require('body-parser');
// const cors = require('cors');

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads(from req.body)
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  connectToMongoDb();
  console.log('server is running on:', PORT);
});
