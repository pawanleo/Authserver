require('dotenv').config();
const mongoose=require('mongoose');
const app =require('./app');
const config=require('./configs')
const envConfig = process.env.NODE_ENV === 'prod' ? config.prod : config.dev;
const port = envConfig.port;
const dbConnectionString = envConfig.connectionString;


mongoose.connect(dbConnectionString)
  .then(() => {
    console.log("Connected to the database successfully");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Database connection failed", err);
    process.exit(1); 
  });
