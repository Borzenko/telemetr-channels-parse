var createError = require('http-errors');
var express = require('express');
const cors = require('cors')

var indexRouter = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/api/', indexRouter);

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

app.listen(3000, async () => {
  console.log('Server is working in 3000')
})

module.exports = app;
