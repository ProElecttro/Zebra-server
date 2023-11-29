// controller.ts

import pdfParse from 'pdf-parse';

const processPdfFile = async (dataBuffer: any) => {
  try {
    const data = await pdfParse(dataBuffer);

    console.log('Number of pages:', data.numpages);
    console.log('PDF Info:', data.info);

    const fileSizeInBytes = dataBuffer.length;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    console.log('File Size:', fileSizeInMB.toFixed(2), 'MB');
  } catch (error) {
    console.error('Error parsing PDF:', error);
  }
};

export const uploadFile = async (req: any, res: any) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Check file extension
    const fileExtension = '.pdf'; // Adjust as needed
    if (file.mimetype.toLowerCase() !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid file format. Expected a PDF file.' });
    }

    // Process PDF file
    await processPdfFile(file.buffer);

    res.json({ message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
