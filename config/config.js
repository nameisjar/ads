require('dotenv').config();

const development = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
};

const test = {
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_DATABASE,
  host: process.env.TEST_DB_HOST,
  dialect: process.env.TEST_DB_DIALECT,
};

const production = {
  username: process.env.PROD_DB_USERNAME,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_DATABASE,
  host: process.env.PROD_DB_HOST,
  dialect: process.env.PROD_DB_DIALECT,
};

module.exports = {
  development,
  test,
  production,
};
