function errorHandler(err, req, res, next) {
  console.log('ERROR: ', err);
  let code = 500;
  let msg = 'Internal Server Error';

  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === 'JsonWebTokenError') {
    code = 401;
    msg = 'Invalid token';
  } else if (err.message === 'Invalid token') {
    code = 401;
    msg = 'Invalid token';
  } else if (err.message === 'Data not found') {
    code = 404;
    msg = 'Data not found';
  } else if (err.message === 'Invalid email or password') {
    code = 400;
    msg = 'Invalid email or password';
  }
  res.status(code).send(msg);
}

module.exports = errorHandler;
