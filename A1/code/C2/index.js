const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 6005;

app.use(express.json());

const volumePath = './data';

app.post('/calculate', (req, res) => {
  try {
    const { file, product } = req.body;
    const filePath = `${volumePath}/${file}`;
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.product === product) {
          rows.push(Number(row.amount));
        }
      })
      .on('end', () => {
        const sum = rows.reduce((acc, val) => acc + val, 0);
        res.json({ file, sum });
      })
      .on('error', () => {
        res.json({ file, error: 'Input file not in CSV format.' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ file: null, error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Container 2 listening on port ${PORT}`);
});
