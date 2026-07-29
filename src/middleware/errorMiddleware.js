export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const globalErrorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error"
  });
};