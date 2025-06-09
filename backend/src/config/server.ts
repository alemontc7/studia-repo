import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes';
import notesRoutes from '../routes/notesRoutes';
import flashcardRoutes from '../routes/flashcardRoutes';
import graphicRoutes from '../routes/graphicsRoutes';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, callback) => {
    console.log('Request origin:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true
}));


app.use('/api/users', userRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/graphic-organizers', graphicRoutes);
app.use('/api/notes', notesRoutes);
app.use('/', (req, res) => {res.send('Hello from studia api');});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
  });
}

export default app;