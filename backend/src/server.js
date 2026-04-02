import 'dotenv/config'; //load environment variables right before establishing the DB connection
import express from 'express';
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cardRoute from './routes/cardRoute.js';
import tagRoute from './routes/tagRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';
import { startCronJobs } from './utils/cron.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public routes
app.use('/api/auth', authRoute);

// private routes
app.use(protectedRoute); //middleware for all the routes below it
app.use('/api/users', userRoute);
app.use('/api/cards', cardRoute);
app.use('/api/tags', tagRoute);
app.use('/api/reviews', reviewRoute);

// connect to the DB before running the server
connectDB().then(() => {
  // Bật cron jobs
  startCronJobs();

  app.listen(PORT, () => {
    console.log(`server started on port ${PORT} `);
  });
});
