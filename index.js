require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = process.env;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(require("./routes"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
