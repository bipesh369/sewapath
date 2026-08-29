const errorHandler = (err, req, res, next) => {
  console.error(err);

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

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;