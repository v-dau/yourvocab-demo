import 'dotenv/config'; //load environment variables right before establishing the DB connection
import express from 'express';
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());

// public routes
app.use('/api/auth', authRoute);

// private routes
app.use(protectedRoute); //middleware for all the routes below it
app.use('/api/users', userRoute);

// connect to the DB before running the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT} `);
  });
});
