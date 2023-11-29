import { Router } from 'express';
import { uploadFile } from './controller';

export const printRoutes = Router();

printRoutes.post('/upload', uploadFile);
