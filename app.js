const express = require('express');
const app = express();
const loginRoutes = require('./routes/authentication');
const parser = require('body-parser');

app.use(parser.json());

app.use(loginRoutes);

app.listen(8080);