const router = require("express").Router();
const {
  helloWorld,
  sortNumsArray,
  presetData,
  localAuthenticate,
} = require("./controller");

// a. GET method /hello and return “Hello World”
router.route("/hello").get(helloWorld());

// b. POST method /sortnum to take an array of numbers as input and return it back sorted ascendingly
router.route("/sortnum").post(sortNumsArray());

// c. POST method /login to accept login and password as input, write a function with sql check that the login is “admin” and password “Admin&8181” then create an access token, set expiry date, save in the session and return that token.
router.route("/login").post(presetData(), localAuthenticate());

module.exports = router;
