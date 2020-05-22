var createError = require('http-errors');
var express = require('express');
const cors = require('cors')
const parser = require('./parser')

var indexRouter = require('./routes/index');
const categoriesRouter  = require('./routes/categories');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/api/', indexRouter);
app.use('/api/', categoriesRouter);

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
  //res.render('error');
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(3000, async () => {
  console.log('Server is working in 3000')
  parser.parseCategory()
})

module.exports = app;
