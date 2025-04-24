const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
require('dotenv').config();

const schoolRoutes = require('../routes/schoolRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api', schoolRoutes);

// Use serverless-http to wrap the app and export it as a handler
module.exports.handler = serverless(app);
