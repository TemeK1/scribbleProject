var createError = require('http-errors');
const express = require('express');

// Required for environmental variables
let dotenv = require('dotenv');
dotenv.config({ path: './bin/.env' });

// Required for easy MongoDB handling
const mongoose = require('mongoose');
// Connect to the database.
mongoose.connect(process.env.APP_DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var sanitize = require("mongo-sanitize");

const app = new express();
var path = require('path');
// Potentially for later use
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

// Lets import the necessary Note controllers.
const searchController = require('./controllers/fetchNotes');
const storeNoteController = require('./controllers/storeNote');
const deleteNoteController = require('./controllers/deleteNote');
const checkNoteStatusController = require('./controllers/checkStatus');

// To sanitize the Note input.
// Middleware.
function cleanInput(req, res, next) {
  req.body = sanitize(req.body);
  // After sanitizing we can proceed to the database-storing.
  next();
}

app.set('views', path.join(__dirname, 'views'));
// Mainly for error templates
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/notes', searchController);
app.get('/notes/check/:time', checkNoteStatusController);
app.post('/notes/write/', cleanInput, storeNoteController);
app.post('/notes/delete/', cleanInput, deleteNoteController);

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
