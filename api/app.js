var createError = require('http-errors');
const express = require('express');

let dotenv = require('dotenv');
dotenv.config({ path: './bin/.env' });

const mongoose = require('mongoose');
mongoose.connect(process.env.APP_DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
var sanitize = require("mongo-sanitize");



const app = new express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
const searchController = require('./controllers/fetchNotes');
const editNoteController = require('./controllers/editNote');
const storeNoteController = require('./controllers/storeNote');

function cleanInput(req, res, next) {
  req.body = sanitize(req.body);
  next();
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/notes', searchController);
app.get('/notes/edit/:id/:order/:title/:text/:left/:top/:color', cleanInput, editNoteController);
app.get('/notes/write/:id/:order/:title/:text/:left/:top/:color', cleanInput, storeNoteController);

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
