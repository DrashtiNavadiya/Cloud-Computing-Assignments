const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 6005;

app.use(express.json());

const volumePath = './DRASHTI_PV_dir';

app.post('/calculate', (req, res) => {
  try {
    const { file, product } = req.body;
    const filePath = `${volumePath}/${file}`;
    const rows = [];
    console.log(filePath)
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const trimmedRow = {};
        Object.keys(row).forEach(key => {
          const trimmedKey = key.trim();
          const trimmedValue = row[key].trim();
          trimmedRow[trimmedKey] = trimmedValue;
        });
        if (trimmedRow.product === product) {
          console.log(product);
          console.log(trimmedRow.amount);
          rows.push(Number(trimmedRow.amount));
        }
      })
      .on('end', () => {
        const sum = rows.reduce((acc, val) => acc + val, 0);
        console.log(sum);
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
  if (!fs.existsSync('./DRASHTI_PV_dir')){
    fs.mkdirSync('./DRASHTI_PV_dir');
  }
  console.log(`Container 2 listening on port ${PORT}`);
});
// comment to check CI CD