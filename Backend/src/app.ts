import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

export default app;
