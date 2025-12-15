var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// Note: If you uncomment the line below, you'll need to create './routes/users.js'
// var usersRouter = require('./routes/users');

var app = express();

// === DELAYED CRASH INJECTION ===
const crashDelayMinutes = 5;
const crashDelayMs = 30 * 1000; // 5 minutes in milliseconds

console.log(`Application started successfully.`);
console.log(`ALERT: Process scheduled to crash in ${crashDelayMinutes} minutes with exit code -1.`);

// Set a timeout to deliberately exit the process with code -1 after 5 minutes
setTimeout(() => {
  console.error("FATAL: Intentional delayed critical failure reached. Forcing exit code -1.");
  // Exit the application with the specified non-zero status code
  process.exit(-1); 
}, crashDelayMs);
// === END DELAYED CRASH INJECTION ===

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
