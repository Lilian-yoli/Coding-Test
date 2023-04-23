const numsArraySchema = {
  type: "array",
  items: {
    type: "integer",
  },
};

const loginInfoSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 1 },
  },
  required: ["name", "password"],
  additionalProperties: false,
};

module.exports = {
  numsArraySchema,
  loginInfoSchema,
};
