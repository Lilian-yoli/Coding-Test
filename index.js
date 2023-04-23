require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = process.env;
const bodyParser = require("body-parser");
const passport = require("passport");

app.use(bodyParser.json());
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});