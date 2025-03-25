import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL || ''];
console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


app.use('/api/users', userRoutes);

// Puerto
const PORT = process.env.PORT || 7000;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
