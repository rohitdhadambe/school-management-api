const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
require('dotenv').config();

const schoolRoutes = require('../routes/schoolRoutes'); // note: path adjusted

const app = express();
app.use(bodyParser.json());

app.use('/api', schoolRoutes);

// Export for Vercel serverless
module.exports.handler = serverless(app);
