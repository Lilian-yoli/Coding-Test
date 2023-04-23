const router = require("express").Router();
const { helloWorld, sortNumsArray } = require("./controller");

// a. GET method /hello and return “Hello World”
router.route("/hello").get(helloWorld());

// b. POST method /sortnum to take an array of numbers as input and return it back sorted ascendingly
router.route("/sortnum").post(sortNumsArray());

module.exports = router;
