const router = require("express").Router();
const {
  helloWorld,
  sortNumsArray,
  presetData,
  localAuthenticate,
  jwtAuthenticate,
  isAuth,
} = require("./controller");

// a. GET method /hello and return “Hello World”
router.route("/hello").get(helloWorld());

// b. POST method /sortnum to take an array of numbers as input and return it back sorted ascendingly
router.route("/sortnum").post(sortNumsArray());

// c. POST method /login to accept login and password as input, write a function with sql check that the login is “admin” and password “Admin&8181” then create an access token, set expiry date, save in the session and return that token.
router.route("/login").post(presetData(), localAuthenticate());

//d. GET method /is_auth return true / false for confirm admin is login before that please use middleware to authorize the accesstoken is valid, if not valid please throw the error, otherwise execute next function.
router.route("/is_auth").get(presetData(), jwtAuthenticate(), isAuth());

module.exports = router;
