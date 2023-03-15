const bcrypt = require("bcrypt");

const passwordHasher = (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = passwordHasher;
