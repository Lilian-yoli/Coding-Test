require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, SESSION_SECRET } = process.env;
const bodyParser = require("body-parser");
const passport = require("passport");

app.use(bodyParser.json());
app.use(
  require("express-session")({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes"));

// Error handle
app.use((req, res, next) => {
  const err = new Error("Page not found.");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({
      error: {
        message: err.message,
      },
    });
  } else {
    res.status(500).send({
      error: {
        message: "Internal Server Error.",
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
