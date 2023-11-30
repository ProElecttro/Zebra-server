import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';

const uploadRouter = express.Router();
const upload = multer();

const calculatePrintingCost = (pages: number, isColor: boolean): number => {
  const colorCostPerPage = 10;
  const bwCostPerPage = 1;

  const costPerPage = isColor ? colorCostPerPage : bwCostPerPage;

  const totalCost = pages * costPerPage;
  return totalCost;
};

uploadRouter.post('/upload', upload.single('fileField'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  // Process PDF file
  let pages = 0;
  let fileSize = file.size;

  try {
    const data = await pdfParse(file.buffer);
    pages = data.numpages;

    if (pages > 20) {
      return res.status(400).json({ error: 'Maximum number of pages exceeded.' });
    }
    const cost = calculatePrintingCost(pages, true);
    return res.status(200).json({ message: 'File ready to print.', cost: cost });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return res.status(500).json({ error: 'Error parsing PDF' });
  }
});

export default uploadRouter;