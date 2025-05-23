// require('./config/connect')
const { sequelize } = require('./models');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/users');
var habitsRouter = require('./routes/habits');
var authRouter = require('./routes/auth');


sequelize.authenticate()
  .then(() => console.log('✅  MySQL connected'))
  .catch(err => { console.error(err); process.exit(1); });
var app = express();

// Konfigurasi CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // atau '*' untuk semua header
  credentials: true // jika kamu kirim cookie atau header otentikasi
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', userRouter);
app.use('/api/habits', habitsRouter);
app.use('/api', authRouter);
app.use("/uploads", express.static("uploads"));

// static routes
app.use('/storage/imageprofile', express.static(path.join(__dirname, 'uploads/imageprofile')));
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
