const express = require('express');
const cors = require('cors');
const app = express();
const users = require('./users/Router');

app.use(cors());
app.use(express.json());
app.use(users);

module.exports = app;