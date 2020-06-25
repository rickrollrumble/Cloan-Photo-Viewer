// express is the express library, a backend framework for a node js environment.
const express = require('express');
// CORS is a node.js package for providing a Connect/Express middleware 
// that can be used to enable CORS with various options.
const cors = require('cors');
// mongoose will help us connect to mongo db database
const mongoose = require('mongoose');
const path = require('path');
// To have environment variables in the .env file
require('dotenv').config();
const URI = require('./config/index');

// Creating express server
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("content-security-policy-report-only", "default-src 'self'; script-src 'self' 'report-sample'; style-src 'self' 'report-sample'; base-uri 'none'; object-src 'none'; report-uri https://5e52f4c893efcda6a7d40460.endpoint.csper.io")
  next();
});
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const imagesRouter = require('./routes/images');
app.use('/images', imagesRouter);

//Serve static assets in productio

// Port that server will be on
app.use(cors());

app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})
const port = process.env.PORT || 5000;

// cors middleware
// allows server to parse json since that's what this server will do

// Database URI from mongo db atlas dashboard
// have to set MONGODB_URI environment variable.

// starting connections 
// useNewUrlParser -> MongoDb node js rewrote driver to parse node js connection strings
// useCreateIndex -> to deal with deprecated function
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connect(process.env.MONGODB_URI || URI);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB datasbse connection established successfully")
});

// // the server will use the files created in routes
// const exercisesRouter = require('./routes/exercises');


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

