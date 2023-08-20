const errorMiddleware = (err, res, next) => {
  err.statusCode = err.statusCode || 405;
  err.message = err.message || "Somthing went wrong";

  return res.status(err.statusCode).json({
    success: false,
    stack: err.stack,
    message: err.message,
  });
};

export default errorMiddleware;
