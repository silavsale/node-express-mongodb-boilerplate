const express = require('express') // Library to build API or web application
const app = express()
const bodyParser = require('body-parser') // used to extract values from request API header, params, query, body(json)
const mongoose = require('mongoose') // used to connect to mongodb and crud operation
const route = require('./routes')

// .env config 
const { parsed: config } = require('dotenv').config(); // env files
global.config = config;

app.use(bodyParser.json());
app.use('/', route);

// Start the server if successfully connected to mongodb server
mongoose.connect(config.DB_CONNECT, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if (error) throw new Error(error);
    app.listen(5000, () => {
        console.log('Server started at port 5000');
    })
})
