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
import informationRouter from './routes/information.routes.js';
import authRouter from './routes/auth.routes.js';
import packageRouter from './routes/package.routes.js';
import bannerRouter from './routes/banner.routes.js';
import blogRouter from './routes/blog.routes.js';
import reviewRouter from './routes/review.routes.js';
import contactRouter from './routes/contact.routes.js';
import bookingRouter from './routes/booking.routes.js';
import serviceRoutes from './routes/service.routes.js';

// //routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/info', informationRouter);
app.use('/api/v1/packages', packageRouter);
app.use('/api/v1/banner', bannerRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/service', serviceRoutes);
app.use('/api/v1/auth', authRouter);
// // http://localhost:8000/api/v1/users/register

export { app };
