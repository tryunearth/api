require('dotenv').config()
const { parse } = require('pg-connection-string')

const config = parse(process.env.DATABASE_URL)
config.ssl = {
  rejectUnauthorized: false,
}

module.exports = {
  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
  testing: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.TEST_DATABASE_URL,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: config,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
}
