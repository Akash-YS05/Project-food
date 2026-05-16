import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import router from './routes';

export const app = express();
const allowedOrigins = [env.CLIENT_APP_URL, env.ADMIN_APP_URL].filter(
  (origin): origin is string => Boolean(origin)
);

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));

app.use('/api/v1', router);
app.use(notFoundHandler);
app.use(errorHandler);
