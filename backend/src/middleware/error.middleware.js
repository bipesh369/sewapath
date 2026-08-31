const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;

    if (err.errors?.email) {
      message = "Invalid email format";
    } else {
      message = "Validation failed";
    }
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  // Hide unexpected internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
  }
  
  // MongoDB duplicate key error
if (err.code === 11000) {
  statusCode = 409;
  message = "A record with this value already exists";
}

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;