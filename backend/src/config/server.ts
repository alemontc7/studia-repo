import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes';


const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/users', userRoutes);

// Puerto
const PORT = process.env.PORT || 7000;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
