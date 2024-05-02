const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
require("dotenv").config();

console.log("here")
const userRoutes = require("./app/routes/UserRoutes");

const app = express();
const port = process.env.PORT || 5050;
const mongoURI = process.env.MONGO_URI;
const databaseName = process.env.DATABASE;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sessionToken: process.env.TOKEN
});
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret Access key:", AWS.config.credentials.secretAccessKey);
    console.log("Token: \n\n", AWS.config.credentials.sessionToken);
  }
});

const secretsManager = new AWS.SecretsManager();

// Retrieve the secret from AWS Secrets Manager
secretsManager.getSecretValue({ SecretId: "Mongodb" }, (err, data) => {
  if (err) {
    console.error("Error retrieving secret from AWS Secrets Manager:", err);
  } else {
    const secret = JSON.parse(data.SecretString);

    // Use the retrieved secret to establish connection to MongoDB
    mongoose.connect(`${mongoURI}${databaseName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: secret.username,
      pass: secret.password
    })
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => console.error("Error connecting to MongoDB:", err));
  }
});
//

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Cloud" });
});

app.use(cors());
app.use(express.json());
app.use("/users/", userRoutes);