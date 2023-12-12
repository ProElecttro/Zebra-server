import express from 'express';
import AppDataSource from './config';
import { authRoutes } from './auth/routes';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import User from './entities/user';

const app = express();
const port = 3003;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

dotenv.config();

const upload = multer();

const calculatePrintingCost = (pages: number, isColor: boolean): number => {
  const colorCostPerPage = 10;
  const bwCostPerPage = 1;

  const costPerPage = isColor ? colorCostPerPage : bwCostPerPage;

  const totalCost = pages * costPerPage;
  return totalCost;
};

app.post('/upload', upload.single('fileField'), async (req, res) => {
  const file = req.file;
  console.log(file)

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  // Process PDF file
  let pages = 0;
  let fileSize = file.size;

  try{
    const data = await pdfParse(file.buffer);
    console.log(data)
    pages = data.numpages
    
    if (pages > 20) {
      return res.status(400).json({ error: 'Maximum number of pages exceeded.' });
    }

    // Save file data in the database
    const userRepo = AppDataSource.getRepository(User);

    const user = new User();
    user.name = 'purushottam';
    user.email = 'purushottam@gmail.com';
    user.password = '12345678';
    user.filename = 'filename.pdf';
    user.fileData = file.buffer;

    await userRepo.save(user);

    const cost = calculatePrintingCost(pages, true);
    return res.status(200).json({ message: 'File ready to print.', cost: cost});
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return res.status(500).json({ error: 'Error parsing PDF' });
  }
});

app.use('/api/v1/auth', authRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Application is running on port ${port}.`);
    });
  })
  .catch((err: any) => console.log('Error:', err));