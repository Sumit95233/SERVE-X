export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(status).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(isProd ? {} : { stack: err.stack }),
  });
};
