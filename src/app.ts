// app.ts

import express from 'express';
import AppDataSource from './config';
import { authRoutes } from './auth/routes';
import { printRoutes } from './print/routes';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

const app = express();
const port = 3003;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

dotenv.config();

// Initialize multer for file uploads
const upload = multer();

// Apply multer middleware to handle file uploads
app.use(upload.single('pdfFile'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/print', printRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Application is running on port ${port}.`);
    });
  })
  .catch((err: any) => console.log('Error:', err));
