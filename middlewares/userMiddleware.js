const express = require('express');
const app = express();

// Middleware for storing user in res.locals
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

module.exports = app;
