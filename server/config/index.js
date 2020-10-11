const dotenv = require('dotenv').config();

const env = process.env;

const IN_PROD = env === 'prod';

module.exports = {
  PORT: env.PORT || 6001,

  ENV: env.env || 'dev',

  API_PREFIX: env.API_PREFIX || '/api',

  REDIS_PORT : env.REDIS_PORT || 6379,

  IN_PROD
}
