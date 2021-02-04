const express = require('express');
const userRoutes = require("./routes/user");
const formRoutes = require("./routes/form");

const config = require('./config/config.json');
const mongoose = require('mongoose');

const port = 3000;

var app = express();

const connection =  mongoose.connect(config.db_conn, {
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);
app.listen(port);