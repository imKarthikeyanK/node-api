var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var weatherRouter = require('./routes/weather');

var mongoUtil = require('./utils/mongo');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


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

// var app = express();

// // view engine setup
// // app.set('views', path.join(__dirname, 'views'));
// // app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/weatherData', weatherRouter)

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   console.log(err)
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.send(err);
// });

// module.exports = app;


/*
the flow,

- create a get api to get the weather data for next 5 days based on the city

===== THE API

>>>>> API to get list of cities and key weather data
- no params
- returns list of cities and their key data

>>>>> API to get detailed infor
- takes city as param
- returns weather data for next 5 days

===== DATA STRUCTURE

----- Expiry - from system environment in minutes
----- Data
    ----- date
          ----- city
                ---- data
    ----- date
          ----- city
                ---- data
    ----- date
          ----- city
                ---- data

====== DATA LOGIC

----- on request
      - check if data present or not expired
        - if not present or expired
          - fetch data for the requested city
          - store data
          - return fetched data
        - if present and not expired
          - return data

----- on request for list of cities
      - check if data present and not expired
        - if not present or expired
          - fetch data for all cities
          - store data
          - return city list with info
        - if present and not expired
          - return city list with info
*/