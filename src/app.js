import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// //routes import
import userRouter from './routes/user.routes.js';
// import slotRouter from './routes/slot.routes.js';
// import bookingRouter from './routes/booking.routes.js';
import authRouter from './routes/auth.routes.js';
// import teamRouter from './routes/team.routes.js';
// //routes declaration
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/slot', slotRouter);
// app.use('/api/v1/booking', bookingRouter);
// app.use('/api/v1/team', teamRouter);
app.use('/api/v1/auth', authRouter);
// // http://localhost:8000/api/v1/users/register

export { app };
