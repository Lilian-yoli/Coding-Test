const Ajv = require("ajv");
const ajv = new Ajv();
const { numsArraySchema } = require("./schema");

const helloWorld = () => {
  return function (req, res) {
    res.status(200).send("Hello World");
  };
};

const sortNumsArray = () => {
  return function (req, res) {
    const validate = ajv.compile(numsArraySchema);
    const { numbers } = req.body;
    const valid = validate(numbers);
    if (!valid) {
      res.status(422).send("Format Error.");
    } else {
      const sortedNumbers = numbers.sort();
      res.status(200).send(sortedNumbers);
    }
  };
};

module.exports = {
  helloWorld,
  sortNumsArray,
};
