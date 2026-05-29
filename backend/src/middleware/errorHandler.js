function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const response = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong',
      details: err.details || {},
    },
  };

  res.status(status).json(response);
}

module.exports = errorHandler;
