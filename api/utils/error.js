const ErrorCustom = (status, message) => {
  const error = new Error();
  error.message = message;
  error.statusCode = status;
  return error;
};

module.exports = { ErrorCustom };
