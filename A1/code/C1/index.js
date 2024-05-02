const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 6000;

app.use(bodyParser.json());

const validateCSVFormat = (filePath) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).pipe(csv());
    
    let headersChecked = false;
    let rowCount=0;

    stream.on('data', (row) => {
      if (!headersChecked) {
        if (!row.product || !row.amount ) {
          stream.destroy(); 
          reject('Input file not in CSV format.');
        }
        headersChecked = true;
      }
      rowCount+=1;

    });

    stream.on('end', () => {
        if (!headersChecked || rowCount === 0) {
            reject('Input file not in CSV format.');
          } else {
            resolve();
          }
    });

    stream.on('error', () => {
      reject('Error reading the CSV file.');
    });
  });
};

app.post('/calculate', async (req, res) => {
  try {
    const { file, product } = req.body;
    if (!file || !product) {
      return res.json({ file: null, error: 'Invalid JSON input.' });
    }
    const fileExists = `./data/${file}`
    if (!fs.existsSync(fileExists)) {
      return res.json({ file, error: 'File not found.' });
    }
    try {
      await validateCSVFormat(fileExists);
    } catch (error) {
      return res.json({ file, error });
    }
    const response = await axios.post('http://container2:6005/calculate', { file, product });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ file: null, error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Container 1 listening on port ${PORT}`);
});
