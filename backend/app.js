const express = require('express');
var cors = require('cors');

const userRoutes = require("./routes/user");
const formRoutes = require("./routes/form");
const answerRoutes = require("./routes/answer");

const config = require('./config/config.json');
const mongoose = require('mongoose');

var app = express();
app.use(cors());

const mongooseConnection = mongoose.connect(config.db_conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render('error', { error: err });
}

app.use(express.json());

app.use("/user", userRoutes);
app.use("/form", formRoutes);
app.use("/answer", answerRoutes);

app.get('/', (req, res) => {
    res.send('Backend is On!');
});

app.use(errorHandler);

module.exports = app;