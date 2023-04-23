const Keyv = require("keyv");
const keyv = new Keyv();
const bcrypt = require("bcrypt");
const salt = parseInt(process.env.BCRYPT_SALT);

const presetDataToKeyv = async () => {
  const password = await bcrypt.hash("Admin&8181", salt);
  const now = new Date();
  await keyv.set("admin", {
    id: 1,
    name: "admin",
    password,
    created: now,
    updated: now,
  });
  await keyv.set(1, "admin");
};

const getUserInfoByKey = async (key) => {
  return await keyv.get(key);
};

module.exports = {
  presetDataToKeyv,
  getUserInfoByKey,
};
