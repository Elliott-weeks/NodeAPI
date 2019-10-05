const express = require('express');
const app = express();
const loginRoutes = require('./routes/authentication');
const jwtAuth = require('./routes/JwtAuthentication');
const parser = require('body-parser');
app.use(parser.json());
app.use(loginRoutes);
app.use(jwtAuth);



app.listen(8080);

module.exports = app;