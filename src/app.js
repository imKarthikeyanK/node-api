var createError = require('http-errors');
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var weatherRouter = require('./routes/weather');

var mongoUtil = require('./utils/mongo');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.options('*', cors());


mongoUtil.connectToServer(function (err, client) {
  if (err) console.log(err);
  // start the rest of your app here

  app.use('/', indexRouter);
  app.use('/weatherData', weatherRouter)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    console.log(err)
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
  });

});

module.exports = app;
