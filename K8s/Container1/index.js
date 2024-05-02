const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 6000;

app.use(bodyParser.json());

app.get('/changes', (req, res) => {
  res.send({ message: 'CI CD is working on Cloud' });
});

const validateCSVFormat = (filePath) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).pipe(csv());
    
    let headersChecked = false;
    let rowCount = 0;

    stream.on('data', (row) => {
      if (!headersChecked) {

        const trimmedRow = {};
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            const trimmedKey = key.trim();
            trimmedRow[trimmedKey] = row[key];
          }
        }

        if (!trimmedRow.product || !trimmedRow.amount) {
          stream.destroy();
          reject('Input file not in CSV format.');
        }
        headersChecked = true;
      }
      rowCount += 1;
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
    const fileExists = `./DRASHTI_PV_dir/${file}`
    if (!fs.existsSync(fileExists)) {
      return res.json({ file, error: 'File not found.' });
    }
    try {
      await validateCSVFormat(fileExists);
    } catch (error) {
      return res.json({ file, error });
    }
    const response = await axios.post('http://c2-service:6005/calculate', { file, product });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ file: null, error: 'Internal server error.' });
  }
});

app.post('/store-file', (req, res) => {
  const dataDirectory = './DRASHTI_PV_dir';
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}
  try {
    const { file, data } = req.body;
    if (!file || !data) {
      return res.json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = `${dataDirectory}/${file}`;

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(err);
        return res.json({ file, error: 'Error while storing the file to the storage.' });
      }
      res.json({ file, message: 'Success.' });
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
  console.log(`Container 1 listening on port ${PORT}`);
});
// comment to check CI CD