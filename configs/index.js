module.exports = {
  dev: {
    port: process.env.PORT || 3001,
    connectionString: process.env.DB_CONNECTION_STRING_DEV,
  },
  prod: {
    port: process.env.PORT || 8080,
    connectionString: process.env.DB_CONNECTION_STRING_PROD,
  },
};
